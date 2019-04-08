import { FEEDS, DATADIR } from '../config/config';
import { NewsGatherer } from './NewsGatherer';

async function main() {
    const newsGatherer = new NewsGatherer(FEEDS, DATADIR);
    await newsGatherer.gatherNews();
}

console.log(`${(new Date()).toISOString()}:: Starting News Gathering ...`);
main().catch(console.error);
console.log(`${(new Date()).toISOString()}:: ... Done News Gathering.`);
