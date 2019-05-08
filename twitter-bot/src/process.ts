import { TweetDumpProcessor } from './TweetDumpProcessor';
import { DATADIR } from '../config/config';

async function main() {
    const fdp = new TweetDumpProcessor(DATADIR);
    await fdp.processAllDumps();
}

main().catch(console.error);