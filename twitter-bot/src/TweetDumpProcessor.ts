import * as fs from 'fs';
import { Tweet } from './Tweet';

const FILES_TOBE_IGNORED = ['.DS_Store'];

export class TweetDumpProcessor {
    tweetsByLink: { [link: string]: Tweet } = {};
    constructor(readonly baseDir: string) {
    }
    async processAllDumps() {
        const sourceDirs = fs.readdirSync(this.baseDir);

        for (const sourceDir of sourceDirs) {
            if (sourceDir.endsWith('.html')) continue;
            if (FILES_TOBE_IGNORED.includes(sourceDir)) continue;
            await this.processDailyDumps(sourceDir);
        }

        const numItems = Object.keys(this.tweetsByLink).length;
        const html = this.generateHTML(this.tweetsByLink);
        const outFile = `combined.html`;
        fs.writeFileSync(`${this.baseDir}/${outFile}`, html);
        console.log(`Generated output file ${outFile} with ${numItems} items ...`);
    }
    async processDailyDumps(sourceDir: string): Promise<number> {
        console.log(`Processing subdir: ${sourceDir}`);
        const tweetsByLink: { [link: string]: Tweet } = {};
        const dailyDumpPath = `${this.baseDir}/${sourceDir}`;
        const dailyDirs = fs.readdirSync(dailyDumpPath);
        for (const dailyDir of dailyDirs) {
            if (FILES_TOBE_IGNORED.includes(dailyDir)) continue;
            const dailyDirPath = `${dailyDumpPath}/${dailyDir}`;
            const feedFiles = fs.readdirSync(dailyDirPath);
            for (const feedFile of feedFiles) {
                const feedFilePath = `${dailyDirPath}/${feedFile}`;
                const tweets = await this.parseFeedFile(feedFilePath);
                this.mergeTweets(tweetsByLink, tweets);
            }
        }
        const numItems = Object.keys(tweetsByLink).length;
        const html = this.generateHTML(tweetsByLink);
        const outFile = `${sourceDir}.html`;
        fs.writeFileSync(`${this.baseDir}/${outFile}`, html);
        console.log(`Generated output file ${outFile} with ${numItems} items ...`);
        return numItems;
    }
    async parseFeedFile(filePath: string): Promise<Tweet[]> {
        const feedData = fs.readFileSync(filePath).toString();
        const jsonObject = await JSON.parse(feedData);
        const tweets: Tweet[] = [];
        for (const status of jsonObject.statuses) {
            let entity = null;
            if (status.entities) {
                entity = Array.isArray(status.entities) ? status.entities[0] : status.entities;
            }
            if (!entity) continue;
            const tweet: Tweet = {
                title: status.text,
                idStr: status.id_str,
                description: '',
                pubDate: new Date(status.created_at),
                link: (entity.urls && Array.isArray(entity.urls) && entity.urls.length > 0 ? entity.urls[0].url : 'nourl'),
                count: 1
            }
            tweets.push(tweet);
        }
        return tweets;
    }
    mergeTweets(tweetsByLink: { [link: string]: Tweet }, tweets: Tweet[]) {
        for (const tweet of tweets) {
            this.addTweet(tweetsByLink, tweet);
            this.addTweet(this.tweetsByLink, tweet);
        }
    }

    addTweet(tweetsByLink: { [link: string]: Tweet }, tweet: Tweet) {
        const link = tweet.link;
        if (link in tweetsByLink) {
            tweetsByLink[link].count += 1;
            if (tweet.pubDate.valueOf() < tweetsByLink[link].pubDate.valueOf()) {
                tweetsByLink[link].pubDate = tweet.pubDate;
            }
        } else {
            tweetsByLink[link] = tweet;
        }
    }

    generateHTML(tweetsByLink: { [link: string]: Tweet }): string {
        const tweets = Object.values(tweetsByLink);
        tweets.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

        const lis = [];
        const ts = (dt: Date) => `${dt.toLocaleTimeString()}, ${dt.toLocaleDateString()}`;
        tweets.forEach(tw => lis.push(`<li>(${tw.count}) ${ts(tw.pubDate)}: <a href="#"
            onClick="myWindow=window.open('${tw.link}', 'myWindow', 'width=600,height=600'); return false;">${tw.title}</a></li>`));
        return `
        <html>
            <body>
                <ol>
                    ${lis.join('\n')}
                </ol>
            </body>
        </html>`;
    }
}
