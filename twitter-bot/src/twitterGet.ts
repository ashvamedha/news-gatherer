import { config } from '../config/config';
import * as Twitter from 'twitter';
import * as util from 'util';

const T = new Twitter(config);
function _twitterGet(qterm: string, params: any, cb: any) {
    T.get(qterm, params, cb);
}
export const twitterGet = util.promisify(_twitterGet);
