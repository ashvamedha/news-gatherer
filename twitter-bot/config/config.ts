require('dotenv').config();

export const config = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

export const QTERMS = [
    'From:MarketWatch',
    'From:ReutersBiz',
    'From:cnbc',
    'From:benzinga',
    'From:bespokeinvest',
    'From:WSJMarkets',
    'From:IBDInvestors',
    'From:ZacksResearch'
];

export const DATADIR = `${process.env.HOME}/dumps/ime`;
export const DELAY = 15; // inter query delay, in seconds.
