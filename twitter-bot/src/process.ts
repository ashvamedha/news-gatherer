import { TweetDumpProcessor } from './TweetDumpProcessor';

const BASEDIR = '/Users/pankajk/dumps/ime';
async function main() {
    const fdp = new TweetDumpProcessor(BASEDIR);
    await fdp.processAllDumps();
}

main().catch(console.error);