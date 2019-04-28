import * as fs from 'fs';
import { config, DELAY } from '../config/config';
import { twitterGet } from './twitterGet';

const sleep = (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, seconds*1000))
}

export class TwitterCrawler {
    constructor(readonly qterms: string[], readonly datadir: string) {
    }
    async crawl() {
        for (const qterm of this.qterms) { 
            const filePath = this.createPath(qterm);
            try {
                await this.getAndSave(qterm, filePath);
                await sleep(DELAY);
            } catch (err) {
                console.log(`getAndSave failed. qterm: ${qterm}, filePath: ${filePath}, error: ${err.message}`);
                break;
            }
        }
    }
    createPath(qterm: string): string {
        const timeStamp = new Date();
        const [date, time] = timeStamp.toISOString().split('T');
        const dir = `${this.datadir}/${qterm}/${date}`;
        this.mkdirp(dir);
        const file = `${time}.json`;
        return `${dir}/${file}`;
    }
    async getAndSave(qterm: string, filePath: string) {
        const params = { q: qterm, count: 100, result_type: 'recent', lang: 'en' };
        const data = await twitterGet('search/tweets', params);
        const text = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, text);
    }
    mkdirp(dir: string) {
        const comps = dir.split('/');
        let path = comps[0]; // comps[0] is ''
        for (let i = 1; i < comps.length; i++) {
            path += `/${comps[i]}`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
        }
    }
}
