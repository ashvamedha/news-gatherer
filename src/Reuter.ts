import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { promisify } from './promisify';

import { NewsItem } from './NewsItem';

const parseXMLString = promisify(xml2js.parseString);

export class Reuter {
    static async parseFeedFile(feedFilePath: string): Promise<NewsItem[]> {
        const feedData = fs.readFileSync(feedFilePath);
        const jsonObject = await parseXMLString(feedData);
        const newsItems: NewsItem[] = [];
        for (const elem of jsonObject.rss.channel) {
            for (const it of elem.item) {
                const newsItem: NewsItem = {
                    title: it.title[0],
                    description: it.description[0],
                    pubDate: new Date(Date.parse(it.pubDate[0])),
                    link: it.link[0],
                    count: 1
                }
                newsItems.push(newsItem);
            }
        }
        return newsItems;
    }
}
