import { CoinMarketCapRegistry } from "./src/CoinMarketCapRegistry";
import { Downloader } from "./src/Downloader";
console.log('Preparing icon scraper');

const COIN_MARKET_CAP_CACHE_DIR = './download_tasks/mapping/';
const OUTPUT_DIR = "./download_tasks/coin-icons-cmc/";
const REPORT_MISSING_DIR = "./download_tasks/report/";

//CoinMarketCapFileRepository.FetchThenCreate('./download_tasks/mapping/', "redacted")
//    .then(success => console.log('success'))
//    .catch(err => console.log(err));
let repo = new CoinMarketCapRegistry();
let downloader = new Downloader(OUTPUT_DIR, REPORT_MISSING_DIR);
downloader
    .execute(repo)
    .then(success => console.log('success'))
    .catch(err => console.log(err));
