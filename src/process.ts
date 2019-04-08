import { FeedDumpProcessor } from './FeedDumpProcessor';
import { CNN } from './CNN';

const BASEDIR = '/Users/pankajk/dumps/ime';
async function main() {
    const fdp = new FeedDumpProcessor(BASEDIR);
    // await fdp.processDailyDumps('feeds.reuters.com/reuters/companyNews');
    await fdp.processDailyDumps('rss.cnn.com/rss/money_markets.rss');
}

main().catch(console.error);
