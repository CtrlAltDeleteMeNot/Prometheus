export class Configuration {
    appRootDir: string = './app/';
    cryptoIconsSvgs = {
        input: 'node_modules/cryptocurrency-icons/svg/color/',
        outputRegistryTsFile: 'ts_libs/ts_client/views/generated/CryptoIconsRegistry.ts',
        lookup: ["GENERIC", "BNB", "BTC", "ETH", "XRP", "XLM", "LINK", "LTC", "TRX", "ZEC", "ADA", "NEO", "ATOM", "ETC", "ALGO", "DOGE", "ONT", "BCH", "SOL", "ARB", "AVAX", "DOT", "INJ", "OP", "ORDI", "SUI", "TIA", "MANTA", "BLUR", "ALT", "SEI", "JUP", "FIL", "WLD", "UNI", "PIXEL", "STRK", "PEPE", "SHIB", "NEAR", "FET", "EUR", "BONK", "FLOKI", "PENDLE", "BOME", "JTO", "WIF", "CKB", "ENA", "ETHFI", "YGG", "CFX", "RUNE", "SAGA", "APT", "GALA", "STX", "ICP", "TRB", "ARKM", "AR", "BB", "CRV", "PEOPLE", "REZ", "ENS", "LDO", "NOT", "TNSR", "ZK", "ZRO", "IO", "1000SATS", "RENDER", "TON", "DOGS", "RARE", "AAVE", "POL", "ACT", "NEIRO", "PNUT", "CATI", "FDUSD", "HBAR", "RAY", "TAO", "APE", "EIGEN", "MEME", "1MBABYDOGE", "CETUS", "COW", "DYDX", "HMSTR", "TURBO", "KAIA", "SAND", "CHZ", "PYTH", "RSR", "W", "XTZ", "ACX", "ORCA", "HIVE", "IDEX", "TLM", "1000CAT", "PENGU", "BIO", "MOVE", "PHA", "STEEM", "USUAL", "AIXBT", "CGPT", "COOKIE", "S", "TRUMP", "ANIME", "BERA", "1000CHEEMS", "TST", "LAYER", "CAKE", "HEI", "KAITO", "SHELL", "GPS", "RED", "EGLD", "OSMO", "T", "CVC", "EURI", "SYN", "VELODROME", "EPIC", "GMX", "RPL", "BMT", "FORM", "IOTA", "JUV", "THE", "VANRY", "NIL", "BEAMX", "VANA", "PARTI", "MUBARAK", "TUT", "BANANAS31", "BROCCOLI714", "THETA", "API3", "AUCTION", "BANANA", "GUN", "QNT", "VET", "ZEN", "BABY", "ONDO", "BIGTIME", "VIRTUAL", "KERNEL", "WCT", "PAXG", "ACH", "GMT", "HYPER", "INIT", "SIGN", "STO", "ENJ", "SYRUP", "KMNO", "SXT", "PUNDIX", "NXPC", "HAEDAL", "HUMA", "A", "SOPH", "RESOLV", "HOME", "FLUX", "MASK", "SUSHI", "SPK", "NEWT", "SAHARA", "LPT", "RVN", "LA", "XAI", "AXS", "COMP", "ERA", "C", "GRT", "ROSE", "CVX", "FUN", "LISTA", "TREE", "TOWNS", "PROVE", "ILV", "MAGIC", "PLUME", "CYBER", "MAV", "SKL", "A2Z", "SSV", "UMA", "DOLO", "MITO", "WLFI", "BFUSD", "NMR", "QTUM", "SOMI", "OPEN", "USDE", "LINEA", "HOLO", "PUMP", "AVNT", "ZKC", "SKY", "BARD", "0G", "IMX", "TWT", "HEMI", "XPL", "MIRA", "FF", "AEVO", "ME", "SNX", "EDEN", "NOM", "2Z", "MORPHO", "ASTER", "WAL", "EUL", "ENSO", "YB", "ZBT", "TURTLE", "GIGGLE", "F", "KITE", "MMT", "DASH", "SAPIEN", "MINA", "XVG", "ALLO", "SOLV", "USD1", "BANK", "MET", "1INCH", "COTI", "LSK", "AT", "DYM", "LUNA", "LUNC", "BREV", "币安人生", "ZKP", "U", "FOGO", "SENT", "ZAMA", "ESP", "MANTRA", "ROBO", "OPN", "NIGHT", "CFG", "KAT", "MANA", "APEX", "HFT", "MNT", "MEW", "KAS", "JASMY", "BRETT", "BBSOL", "SWELL", "ICNT", "H", "SPX", "CC", "AEDZ"],
    };
    actionsIconsSvgs = {
        input: 'node_modules/lineicons/assets/svgs/regular/',
        lookup: ['menu-hamburger-1', 'refresh-circle-1-clockwise', 'xmark', 'funnel-1', 'sort-high-to-low', 'arrow-right', 'minus-circle'],
        outputRegistryTsFile: 'ts_libs/ts_client/views/generated/ActionIconsRegistry.ts',
    };
    esClientJs = {
        input: 'ts_libs/ts_client/index.ts',
        output: 'app/js/client/bundle.js',
        outputDir: 'app/js/client/',
        watch: 'ts_libs/ts_client/**/*.ts'
    };
    esClientCss = {
        input: 'ts_libs/es_css/index.css',
        output: 'app/css/client/bundle.css',
        outputDir: 'app/css/client/',
        watch: 'ts_libs/es_css/**/*.css'
    };
    esWorkerJs = {
        input: 'ts_libs/ts_worker/index.ts',
        output: 'app/js/worker/worker.js',
        outputDir: 'app/js/worker/',
        watch: 'ts_libs/ts_worker/**/*.ts'
    };
};

export const config = new Configuration();