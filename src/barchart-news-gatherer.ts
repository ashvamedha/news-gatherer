import { BARCHART_URLS, DATADIR } from '../config/config';
import { NewsGatherer } from './NewsGatherer';

async function main() {
    const newsGatherer = new NewsGatherer(BARCHART_URLS, DATADIR);
    await newsGatherer.gatherNews();
}

console.log(`${(new Date()).toISOString()}:: Starting Barchart News Gathering ...`);
main().catch(console.error);
console.log(`${(new Date()).toISOString()}:: ... Done Barchart News Gathering.`);