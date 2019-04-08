/*
 * Promisifies a nodestyle async function: obj.asyncFn(arg1, arg2, ..., function(err, data){})
 */
export function promisify(original, obj?: any) {
    if (obj && typeof original === 'string') {
        // tslint:disable-next-line:no-parameter-reassignment
        original = obj[original]
    }

    function fn(...args): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            try {
                original.call(obj, ...args, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });

        return promise;
    }

    return fn;
}
