import { QTERMS, DATADIR } from '../config/config';
import { TwitterCrawler } from './TwitterCrawler';

async function main() {
    const newsGatherer = new TwitterCrawler(QTERMS, DATADIR);
    await newsGatherer.crawl();
}

console.log(`${(new Date()).toISOString()}:: Starting Twitter Crawl ...`);
main().then(()=> {
    console.log(`${(new Date()).toISOString()}:: ... Done Crawling Twitter.`);
}).catch(console.error);
