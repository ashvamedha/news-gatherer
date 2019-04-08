import * as fs from 'fs';
import { NewsItem } from './NewsItem';
import { Reuter } from './Reuter';

const FILES_TOBE_IGNORED = ['.DS_Store'];

export class FeedDumpProcessor {
    newsItemsByLink: { [link: string]: NewsItem } = {};
    constructor(readonly baseDir: string) {
    }
    async processDailyDumps(dailDumpPathComponent: string) {
        const dailyDumpPath = `${this.baseDir}/${dailDumpPathComponent}`;
        const dailyDirs = fs.readdirSync(dailyDumpPath);
        let countNewsItems = 0;
        for (const dailyDir of dailyDirs) {
            if (FILES_TOBE_IGNORED.includes(dailyDir)) continue;
            const dailyDirPath = `${dailyDumpPath}/${dailyDir}`;
            const feedFiles = fs.readdirSync(dailyDirPath);
            for (const feedFile of feedFiles) {
                const feedFilePath = `${dailyDirPath}/${feedFile}`;
                const newsItems = await Reuter.parseFeedFile(feedFilePath);
                countNewsItems += newsItems.length;
                this.merge(newsItems);
            }
        }
        this.generateHTML();
    }
    merge(newsItems: NewsItem[]) {
        for (const newsItem of newsItems) {
            const link = newsItem.link;
            if (link in this.newsItemsByLink) {
                this.newsItemsByLink[link].count += 1;
            } else {
                this.newsItemsByLink[link] = newsItem;
            }
        }
    }
    generateHTML() {
        const newsItems = Object.values(this.newsItemsByLink);
        newsItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
        console.log('<html><body><ol>');
        newsItems.forEach(ni => console.log(`<li>${ni.pubDate}: <a href="${ni.link}">${ni.title}</a> ${ni.description}</li>`));
        console.log('</ol></body></html>');
    }
}