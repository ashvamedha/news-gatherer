import { URL } from 'url';
import * as fs from 'fs';
import * as fetch from 'node-fetch';

export class NewsGatherer {
    constructor(readonly feeds: string[], readonly datadir: string) {
    }
    async gatherNews() {
        for (const feed of this.feeds) {
            const url = feed;
            const filePath = this.createPath(url);
            try {
                await this.readAndSave(url, filePath);
            } catch (err) {
                console.log(`readAndSave failed. url: ${url}, filePath: ${filePath}`);
            }
        }
    }
    createPath(url: string): string {
        const parsedURL = new URL(url);
        const timeStamp = new Date();
        const [date, time] = timeStamp.toISOString().split('T');
        const dir = `${this.datadir}/${parsedURL.hostname}${parsedURL.pathname}/${date}`;
        this.mkdirp(dir);
        const file = `${time}.rss`;
        return `${dir}/${file}`;
    }
    async readAndSave(url: string, filePath: string) {
        const response = await fetch(url);
        const text = await response.text();
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
