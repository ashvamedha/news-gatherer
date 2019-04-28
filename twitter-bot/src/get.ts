import { config } from '../config/config';
import { twitterGet } from './twitterGet';

async function main() {
    if (process.argv.length < 3) {
        console.log('Usage:: ts-node get.ts <search-term>');
        process.exit(-1);
    }
    const params = {
        q: process.argv[2],
        count: 100,
        result_type: 'recent',
        lang: 'en'
    }
    const data = await twitterGet('search/tweets', params);
    console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
