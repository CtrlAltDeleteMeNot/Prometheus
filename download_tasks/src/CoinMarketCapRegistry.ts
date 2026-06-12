import fs from "fs";
import path from "path";
import { TradingPair } from "../../ts_libs/ts_worker/domain/entities/TradingPair";



export class CoinMarketCapRegistry {
    private cmcIdentifiers: Map<string, Map<string, number>>;
    public constructor() {
        var binance = new Map<string, number>();
        var bybit = new Map<string, number>();
        this.cmcIdentifiers = new Map<string, Map<string, number>>();
        this.cmcIdentifiers.set("binance", binance);
        this.cmcIdentifiers.set("bybit", bybit);
        this.addBinanceIdentifiers(binance);
        this.addBybitIdentifiers(bybit);
    }

    public findBySymbol(tradingPair: TradingPair): number {
        const symbol = tradingPair.getBaseAsset().symbol.toLowerCase();
        const exchangeName = tradingPair.getExchangeDescriptor().getName().toLowerCase();

        var exchangePairs = this.cmcIdentifiers.get(exchangeName);
        if (exchangePairs === undefined) {
            throw new Error(`Exchange ${exchangeName} is not registered.`);
        }
        var symbolId = exchangePairs.get(symbol);
        if (symbolId === undefined) {
            throw new Error(`Exchange ${exchangeName} has no registered symbol named ${symbol}`);
        }
        return symbolId;
    }



    public getIconUrl(tradingPair: TradingPair): string {
        const entry = this.findBySymbol(tradingPair);
        return `https://s2.coinmarketcap.com/static/img/coins/128x128/${entry}.png`;
    }

    public async downloadIcon(
        tradingPair: TradingPair,
        outputDir: string
    ): Promise<boolean> {
        try {
            const iconUrl = this.getIconUrl(tradingPair);
            if (!iconUrl) {
                return false;
            }

            const response = await fetch(iconUrl, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                        "(KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
                    "Accept": "image/*"
                }
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to download ${tradingPair.getBaseAsset().symbol} icon: HTTP ${response.status}`
                );
            }

            const contentType = response.headers.get("content-type") ?? "";

            if (!contentType.startsWith("image/")) {
                throw new Error(
                    `Invalid image content type for ${tradingPair.getBaseAsset().symbol}: ${contentType}`
                );
            }

            const buffer = Buffer.from(
                await response.arrayBuffer()
            );
            fs.mkdirSync(outputDir, { recursive: true });
            let outputPath = path.join(outputDir, `${tradingPair.getExchangeDescriptor().getName().toLowerCase()}_${tradingPair.getBaseAsset().symbol.toLowerCase()}.png`);
            fs.writeFileSync(outputPath, buffer);

            return true;
        } catch (err) {
            console.log(
                `Could not download ${tradingPair.getExchangeDescriptor().getName()} ${tradingPair.getBaseAsset().symbol}:`,
                err
            );
            return false;
        }
    }

    private addBinanceIdentifiers(repo: Map<string, number>) {
        repo.set("xlm", 512); // Stellar (XLM), rank 15, stellar
        repo.set("link", 1975); // Chainlink (LINK), rank 17, chainlink
        repo.set("trx", 1958); // TRON (TRX), rank 8, tron
        repo.set("neo", 1376); // Neo (NEO), rank 147, neo
        repo.set("atom", 3794); // Cosmos (ATOM), rank 55, cosmos
        repo.set("etc", 1321); // Ethereum Classic (ETC), rank 53, ethereum-classic
        repo.set("algo", 4030); // Algorand (ALGO), rank 62, algorand
        repo.set("ont", 2566); // Ontology (ONT), rank 422, ontology
        repo.set("bch", 1831); // Bitcoin Cash (BCH), rank 22, bitcoin-cash
        repo.set("avax", 5805); // Avalanche (AVAX), rank 28, avalanche
        repo.set("dot", 6636); // Polkadot (DOT), rank 44, polkadot-new
        repo.set("inj", 7226); // Injective (INJ), rank 75, injective
        repo.set("op", 11840); // Optimism (OP), rank 132, optimism-ethereum
        repo.set("ordi", 25028); // ORDI (ORDI), rank 318, ordi
        repo.set("sui", 20947); // Sui (SUI), rank 26, sui
        repo.set("tia", 22861); // Celestia (TIA), rank 103, celestia
        repo.set("manta", 13631); // Manta Network (MANTA), rank 480, manta-network
        repo.set("blur", 23121); // Blur (BLUR), rank 404, blur-token
        repo.set("alt", 29073); // Altlayer (ALT), rank 469, altlayer
        repo.set("sei", 23149); // Sei (SEI), rank 95, sei
        repo.set("fil", 2280); // Filecoin (FIL), rank 72, filecoin
        repo.set("wld", 13502); // Worldcoin (WLD), rank 39, worldcoin-org
        repo.set("pixel", 29335); // Pixels (PIXEL), rank 753, pixels
        repo.set("near", 6535); // NEAR Protocol (NEAR), rank 32, near-protocol
        repo.set("fet", 3773); // Artificial Superintelligence Alliance (FET), rank 86, artificial-superintelligence-alliance
        repo.set("pendle", 9481); // Pendle (PENDLE), rank 129, pendle
        repo.set("bome", 29870); // BOOK OF MEME (BOME), rank 581, book-of-meme
        repo.set("jto", 28541); // Jito (JTO), rank 109, jito
        repo.set("ckb", 4948); // Nervos Network (CKB), rank 377, nervos-network
        repo.set("ena", 30171); // Ethena (ENA), rank 66, ethena
        repo.set("ethfi", 29814); // ether.fi (ETHFI), rank 110, ether-fi-ethfi
        repo.set("ygg", 10688); // Yield Guild Games (YGG), rank 732, yield-guild-games
        repo.set("cfx", 7334); // Conflux (CFX), rank 123, conflux-network
        repo.set("rune", 4157); // THORChain (RUNE), rank 153, thorchain
        repo.set("saga", 30372); // Saga (SAGA), rank 1219, saga
        repo.set("apt", 21794); // Aptos (APT), rank 77, aptos
        repo.set("gala", 7080); // Gala (GALA), rank 158, gala
        repo.set("stx", 4847); // Stacks (STX), rank 98, stacks
        repo.set("icp", 8916); // Internet Computer (ICP), rank 50, internet-computer
        repo.set("trb", 4944); // Tellor (TRB), rank 494, tellor
        repo.set("arkm", 27565); // Arkham (ARKM), rank 613, arkham
        repo.set("ar", 5632); // Arweave (AR), rank 160, arweave
        repo.set("bb", 30746); // BounceBit (BB), rank 657, bouncebit
        repo.set("crv", 6538); // Curve DAO Token (CRV), rank 93, curve-dao-token
        repo.set("people", 14806); // ConstitutionDAO (PEOPLE), rank 616, constitutiondao
        repo.set("rez", 30843); // Renzo (REZ), rank 615, renzo
        repo.set("ens", 13855); // Ethereum Name Service (ENS), rank 134, ethereum-name-service
        repo.set("ldo", 8000); // Lido DAO (LDO), rank 126, lido-dao
        repo.set("not", 28850); // Notcoin (NOT), rank 455, notcoin
        repo.set("tnsr", 30449); // Tensor (TNSR), rank 835, tensor
        repo.set("zk", 24091); // ZKsync (ZK), rank 167, zksync
        repo.set("zro", 26997); // LayerZero (ZRO), rank 102, layerzero
        repo.set("io", 29835); // io.net (IO), rank 346, io-net
        repo.set("1000sats", 28194); // SATS (Ordinals) (SATS), rank 721, sats-ordinals
        repo.set("render", 5690); // Render (RENDER), rank 60, render
        repo.set("rare", 11294); // SuperRare (RARE), rank 950, superrare
        repo.set("aave", 7278); // Aave (AAVE), rank 57, aave
        repo.set("pol", 28321); // Polygon (prev. MATIC) (POL), rank 64, polygon-ecosystem-token
        repo.set("act", 33566); // Act I : The AI Prophecy (ACT), rank 984, act-i-the-ai-prophecy
        repo.set("neiro", 32521); // Neiro (NEIRO), rank 591, neiro
        repo.set("pnut", 33788); // Peanut the Squirrel (PNUT), rank 453, peanut-the-squirrel
        repo.set("cati", 32966); // Catizen (CATI), rank 628, catizen
        repo.set("hbar", 4642); // Hedera (HBAR), rank 24, hedera
        repo.set("ray", 8526); // Raydium (RAY), rank 144, raydium
        repo.set("tao", 22974); // Bittensor (TAO), rank 35, bittensor
        repo.set("eigen", 30494); // EigenCloud (EIGEN), rank 151, eigencloud
        repo.set("meme", 28301); // Memecoin (MEME), rank 505, meme
        repo.set("1mbabydoge", 10407); // Baby Doge Coin (BabyDoge), rank 340, baby-doge-coin
        repo.set("cetus", 25114); // Cetus Protocol (CETUS), rank 768, cetus-protocol
        repo.set("cow", 19269); // CoW Protocol (COW), rank 198, cow-protocol
        repo.set("dydx", 28324); // dYdX (DYDX), rank 181, dydx-chain
        repo.set("hmstr", 32195); // Hamster Kombat (HMSTR), rank 735, hamster-kombat
        repo.set("turbo", 24911); // Turbo (TURBO), rank 343, turbo
        repo.set("kaia", 32880); // Kaia (KAIA), rank 125, kaia
        repo.set("sand", 6210); // The Sandbox (SAND), rank 146, the-sandbox
        repo.set("chz", 4066); // Chiliz (CHZ), rank 107, chiliz
        repo.set("pyth", 28177); // Pyth Network (PYTH), rank 108, pyth-network
        repo.set("rsr", 3964); // Reserve Rights (RSR), rank 195, reserve-rights
        repo.set("w", 29587); // Wormhole (W), rank 379, wormhole
        repo.set("xtz", 2011); // Tezos (XTZ), rank 115, tezos
        repo.set("acx", 22620); // Across Protocol (ACX), rank 574, across-protocol
        repo.set("orca", 11165); // Orca (ORCA), rank 336, orca
        repo.set("hive", 5370); // Hive (HIVE), rank 608, hive-blockchain
        repo.set("tlm", 9119); // Alien Worlds (TLM), rank 1105, alien-worlds
        repo.set("1000cat", 32724); // Simon's Cat (CAT), rank 913, simonscat
        repo.set("pengu", 34466); // Pudgy Penguins (PENGU), rank 87, pudgy-penguins
        repo.set("bio", 34812); // Bio Protocol (BIO), rank 310, bio
        repo.set("pha", 6841); // Phala Network (PHA), rank 604, phala-network
        repo.set("steem", 1230); // Steem (STEEM), rank 652, steem
        repo.set("usual", 33979); // Usual (USUAL), rank 747, usual
        repo.set("aixbt", 34103); // aixbt (AIXBT), rank 679, aixbt
        repo.set("cgpt", 23756); // ChainGPT (CGPT), rank 719, chaingpt
        repo.set("cookie", 31838); // Cookie DAO (COOKIE), rank 1075, cookie
        repo.set("s", 32684); // Sonic (S), rank 189, sonic
        repo.set("anime", 35319); // Animecoin (ANIME), rank 780, anime
        repo.set("bera", 24647); // Berachain (BERA), rank 303, berachain
        repo.set("1000cheems", 33280); // Cheems (cheems.pet) (CHEEMS), rank 177, cheems-pet
        repo.set("tst", 35647); // Test (TST), rank 818, test-token-bsc
        repo.set("layer", 35429); // Solayer (LAYER), rank 582, solayer
        repo.set("cake", 7186); // PancakeSwap (CAKE), rank 82, pancakeswap
        repo.set("hei", 35724); // Heima (HEI), rank 1032, heima
        repo.set("kaito", 35763); // KAITO (KAITO), rank 178, kaito
        repo.set("shell", 35710); // MyShell (SHELL), rank 979, myshell
        repo.set("gps", 35268); // GoPlus Security (GPS), rank 537, goplus-security
        repo.set("red", 21707); // RedStone (RED), rank 473, redstone
        repo.set("egld", 6892); // MultiversX (EGLD), rank 194, multiversx-egld
        repo.set("osmo", 12220); // Osmosis (OSMO), rank 523, osmosis
        repo.set("t", 17751); // Threshold (T), rank 450, threshold
        repo.set("cvc", 1816); // Civic (CVC), rank 675, civic
        repo.set("syn", 12147); // Synapse (SYN), rank 1120, synapse-2
        repo.set("velodrome", 20435); // Velodrome Finance (VELO), rank 879, velodrome-finance
        repo.set("epic", 8615); // Epic Chain (EPIC), rank 680, epic-chain
        repo.set("gmx", 11857); // GMX (GMX), rank 357, gmx
        repo.set("rpl", 2943); // Rocket Pool (RPL), rank 576, rocket-pool
        repo.set("bmt", 35214); // Bubblemaps (BMT), rank 1001, bubblemaps
        repo.set("form", 23635); // Four (FORM), rank 187, binaryx-new
        repo.set("iota", 1720); // IOTA (IOTA), rank 131, iota
        repo.set("the", 23335); // THENA (THE), rank 995, thena
        repo.set("vanry", 8037); // Vanar Chain (VANRY), rank 1039, vanar
        repo.set("nil", 35702); // Nillion (NIL), rank 766, nillion
        repo.set("beamx", 28298); // Beam (BEAM), rank 287, onbeam
        repo.set("vana", 34619); // Vana (VANA), rank 544, vana
        repo.set("parti", 36102); // Particle Network (PARTI), rank 546, particle-network
        repo.set("mubarak", 36041); // Mubarak (MUBARAK), rank 936, mubarak
        repo.set("tut", 35892); // Tutorial (TUT), rank 1020, tutorial
        repo.set("bananas31", 34118); // Banana For Scale (BANANAS31), rank 185, banana-for-scale
        repo.set("broccoli714", 35749); // CZ's Dog (BROCCOLI), rank 855, broccoli-714
        repo.set("theta", 2416); // Theta Network (THETA), rank 143, theta-network
        repo.set("api3", 7737); // API3 (API3), rank 686, api3
        repo.set("auction", 8602); // Bounce Token (AUCTION), rank 632, bounce-token
        repo.set("banana", 28066); // Banana Gun (BANANA), rank 904, banana-gun
        repo.set("gun", 36156); // GUNZ (GUN), rank 836, gunz
        repo.set("qnt", 3155); // Quant (QNT), rank 63, quant
        repo.set("vet", 3077); // VeChain (VET), rank 88, vechain
        repo.set("zen", 1698); // Horizen (ZEN), rank 199, horizen
        repo.set("baby", 32198); // Babylon (BABY), rank 371, babylon
        repo.set("ondo", 21159); // Ondo (ONDO), rank 41, ondo-finance
        repo.set("bigtime", 28230); // Big Time (BIGTIME), rank 691, big-time
        repo.set("virtual", 29420); // Virtuals Protocol (VIRTUAL), rank 92, virtual-protocol
        repo.set("kernel", 36180); // KernelDAO (KERNEL), rank 843, kerneldao
        repo.set("wct", 33152); // WalletConnect Token (WCT), rank 736, walletconnect-token
        repo.set("paxg", 4705); // PAX Gold (PAXG), rank 37, pax-gold
        repo.set("ach", 6958); // Alchemy Pay (ACH), rank 386, alchemy-pay
        repo.set("gmt", 18069); // GMT (GMT), rank 643, green-metaverse-token
        repo.set("hyper", 36281); // Hyperlane (HYPER), rank 660, hyperlane
        repo.set("init", 33120); // Initia (INIT), rank 911, initia
        repo.set("sign", 35600); // Sign (SIGN), rank 728, sign
        repo.set("sto", 32194); // StakeStone (STO), rank 902, stakestone
        repo.set("enj", 2130); // Enjin Coin (ENJ), rank 360, enjin-coin
        repo.set("syrup", 33824); // Maple Finance (SYRUP), rank 142, maple-finance
        repo.set("kmno", 30986); // Kamino (KMNO), rank 307, kamino-finance
        repo.set("sxt", 36405); // Space and Time (SXT), rank 852, space-and-time
        repo.set("nxpc", 36044); // NEXPACE (NXPC), rank 174, maplestory-universe
        repo.set("haedal", 36369); // Haedal Protocol (HAEDAL), rank 1046, haedal-protocol
        repo.set("huma", 36576); // Huma Finance (HUMA), rank 328, huma-finance
        repo.set("a", 36462); // Vaulta (A), rank 168, vaulta
        repo.set("soph", 32087); // Sophon (SOPH), rank 938, sophon
        repo.set("resolv", 36713); // Resolv (RESOLV), rank 1106, resolv
        repo.set("home", 36133); // Defi App (HOME), rank 157, defi-app
        repo.set("flux", 3029); // Flux (FLUX), rank 696, zel
        repo.set("mask", 8536); // Mask Network (MASK), rank 518, mask-network
        repo.set("sushi", 6758); // SushiSwap (SUSHI), rank 397, sushiswap
        repo.set("spk", 36569); // Spark (SPK), rank 364, spark
        repo.set("newt", 36861); // Newton Protocol (NEWT), rank 883, newton-protocol
        repo.set("sahara", 36671); // Sahara AI (SAHARA), rank 359, sahara-ai
        repo.set("lpt", 3640); // Livepeer (LPT), rank 193, livepeer
        repo.set("rvn", 2577); // Ravencoin (RVN), rank 309, ravencoin
        repo.set("la", 36510); // Lagrange (LA), rank 842, lagrange
        repo.set("xai", 28933); // Xai (XAI), rank 784, xai-games
        repo.set("axs", 6783); // Axie Infinity (AXS), rank 140, axie-infinity
        repo.set("comp", 5692); // Compound (COMP), rank 137, compound
        repo.set("era", 37374); // Caldera (ERA), rank 826, caldera
        repo.set("c", 37340); // Chainbase (C), rank 533, chainbase
        repo.set("grt", 6719); // The Graph (GRT), rank 130, the-graph
        repo.set("rose", 7653); // Oasis (ROSE), rank 419, oasis-network
        repo.set("cvx", 9903); // Convex Finance (CVX), rank 156, convex-finance
        repo.set("lista", 21533); // Lista DAO (LISTA), rank 704, lista-dao
        repo.set("tree", 37495); // Treehouse (TREE), rank 1081, treehouse
        repo.set("towns", 37571); // Towns (TOWNS), rank 1083, towns
        repo.set("prove", 37593); // Succinct (PROVE), rank 490, succinct
        repo.set("ilv", 8719); // Illuvium (ILV), rank 655, illuvium
        repo.set("magic", 14783); // Treasure (MAGIC), rank 803, magic-token
        repo.set("plume", 35364); // Plume (PLUME), rank 342, plume
        repo.set("cyber", 24781); // Cyber (CYBER), rank 653, cyberconnect
        repo.set("skl", 5691); // SKALE (SKL), rank 624, skale-network
        repo.set("ssv", 12999); // ssv.network (SSV), rank 508, ssv-network
        repo.set("uma", 5617); // UMA (UMA), rank 521, uma
        repo.set("dolo", 35929); // Dolomite (DOLO), rank 960, dolomite
        repo.set("mito", 38204); // Mitosis (MITO), rank 1359, mitosis
        repo.set("wlfi", 33251); // World Liberty Financial (WLFI), rank 36, world-liberty-financial-wlfi
        repo.set("nmr", 1732); // Numeraire (NMR), rank 330, numeraire
        repo.set("somi", 37637); // Somnia (SOMI), rank 638, somnia
        repo.set("open", 37456); // OpenLedger (OPEN), rank 320, openledger
        repo.set("linea", 27657); // Linea (LINEA), rank 500, linea
        repo.set("holo", 38309); // Holoworld AI (HOLO), rank 429, holoworld-ai
        repo.set("pump", 36507); // Pump.fun (PUMP), rank 80, pump-fun
        repo.set("avnt", 38299); // Avantis (AVNT), rank 511, avantis
        repo.set("zkc", 38371); // Boundless (ZKC), rank 824, boundless
        repo.set("sky", 33038); // Sky (SKY), rank 49, sky
        repo.set("bard", 38408); // Lombard (BARD), rank 412, lombard
        repo.set("0g", 38337); // 0G (0G), rank 334, zero-gravity
        repo.set("imx", 10603); // Immutable (IMX), rank 106, immutable-x
        repo.set("twt", 5964); // Trust Wallet Token (TWT), rank 139, trust-wallet-token
        repo.set("hemi", 38159); // Hemi (HEMI), rank 1181, hemi
        repo.set("xpl", 36645); // Plasma (XPL), rank 163, plasma-xpl
        repo.set("mira", 38495); // Mira (MIRA), rank 796, mira-network
        repo.set("ff", 38482); // Falcon Finance (FF), rank 135, falcon-finance-ff
        repo.set("aevo", 29676); // Aevo (AEVO), rank 765, aevo
        repo.set("me", 32197); // Magic Eden (ME), rank 559, magiceden
        repo.set("snx", 2586); // Synthetix (SNX), rank 196, synthetix
        repo.set("eden", 38513); // OpenEden (EDEN), rank 811, openeden
        repo.set("nom", 38464); // Nomina (NOM), rank 1230, nomina
        repo.set("2z", 38515); // DoubleZero (2Z), rank 117, doublezero
        repo.set("morpho", 34104); // Morpho (MORPHO), rank 56, morpho
        repo.set("aster", 36341); // Aster (ASTER), rank 40, aster
        repo.set("wal", 36119); // Walrus (WAL), rank 200, walrus-xyz
        repo.set("eul", 14280); // Euler (EUL), rank 699, euler-finance
        repo.set("enso", 38668); // Enso (ENSO), rank 892, enso
        repo.set("yb", 38651); // YieldBasis (YB), rank 928, yieldbasis
        repo.set("zbt", 38427); // ZEROBASE (ZBT), rank 600, zerobase
        repo.set("turtle", 38671); // Turtle (TURTLE), rank 1168, turtle-xyz
        repo.set("giggle", 38470); // Giggle Fund (GIGGLE), rank 618, giggle-fund
        repo.set("f", 34297); // SynFutures (F), rank 773, synfutures
        repo.set("kite", 38828); // Kite (KITE), rank 97, kite
        repo.set("mmt", 38231); // Momentum (MMT), rank 688, momentum-token
        repo.set("sapien", 38117); // Sapien (SAPIEN), rank 705, sapien-io
        repo.set("mina", 8646); // Mina (MINA), rank 380, mina
        repo.set("allo", 38908); // Allora (ALLO), rank 273, allora
        repo.set("solv", 12165); // Solv Protocol (SOLV), rank 1215, solv-protocol
        repo.set("bank", 36296); // Lorenzo Protocol (BANK), rank 378, lorenzo-protocol
        repo.set("met", 38353); // Meteora (MET), rank 372, meteora
        repo.set("1inch", 8104); // 1inch (1INCH), rank 179, 1inch
        repo.set("coti", 3992); // COTI (COTI), rank 610, coti
        repo.set("lsk", 1214); // Lisk (LSK), rank 712, lisk
        repo.set("at", 38757); // APRO (AT), rank 564, apro
        repo.set("dym", 28932); // Dymension (DYM), rank 1003, dymension
        repo.set("luna", 20314); // Terra (LUNA), rank 506, terra-luna-v2
        repo.set("brev", 39159); // Brevis (BREV), rank 718, brevis
        repo.set("币安人生", 38590); // 币安人生 (币安人生), rank 65, bianrensheng
        repo.set("zkp", 39035); // zkPass (ZKP), rank 802, zkpass
        repo.set("u", 39120); // United Stables (U), rank 54, united-stables
        repo.set("fogo", 38356); // Fogo (FOGO), rank 444, fogo
        repo.set("sent", 38868); // Sentient (SENT), rank 169, sentient
        repo.set("zama", 39332); // Zama (ZAMA), rank 308, zama
        repo.set("esp", 39548); // Espresso (ESP), rank 526, espresso
        repo.set("mantra", 39611); // MANTRA (MANTRA), rank 463, mantra-new
        repo.set("robo", 39595); // Fabric Protocol (ROBO), rank 411, fabric-foundation
        repo.set("opn", 39564); // Opinion (OPN), rank 758, opinion
        repo.set("night", 39064); // Midnight (NIGHT), rank 74, midnight-network
        repo.set("cfg", 6748); // Centrifuge (CFG), rank 166, centrifuge
        repo.set("kat", 38769); // Katana (KAT), rank 801, katana-network
        repo.set("chip", 39870); // USD.AI (CHIP), rank 324, usd-ai
        repo.set("mega", 38770); // MegaETH (MEGA), rank 390, megaeth
        repo.set("aigensyn", 39883); // Gensyn (AI), rank 502, gensyn
        repo.set("genius", 39841); // Genius Terminal (GENIUS), rank 148, genius-terminal
        repo.set("opg", 39800); // OpenGradient (OPG), rank 561, opengradient

        repo.set("bnb", 1839);
        repo.set("btc", 1);
        repo.set("eth", 1027);
        repo.set("xrp", 52);
        repo.set("ltc", 2);
        repo.set("zec", 1437);
        repo.set("ada", 2010);
        repo.set("doge", 74);
        repo.set("sol", 5426);
        repo.set("arb", 11841);
        repo.set("jup", 29210);
        repo.set("uni", 7083);
        repo.set("strk", 22691);
        repo.set("pepe", 24478);
        repo.set("shib", 5994);
        repo.set("bonk", 23095);
        repo.set("floki", 10804);
        repo.set("wif", 28752);
        repo.set("ton", 11419);
        repo.set("dogs", 33083);
        repo.set("ape", 18876);
        repo.set("move", 32452);
        repo.set("trump", 35336);
        repo.set("dash", 131);
        repo.set("xvg", 693);
        repo.set("lunc", 4172);
    }


    private addBybitIdentifiers(repo: Map<string, number>) {
        // Shared high-confidence CMC identifiers used by Bybit spot pairs.
        repo.set("btc", 1); // Bitcoin (BTC), bitcoin
        repo.set("eth", 1027); // Ethereum (ETH), ethereum
        repo.set("sol", 5426); // Solana (SOL), solana
        repo.set("xrp", 52); // XRP (XRP), xrp
        repo.set("lunc", 4172); // Terra Classic (LUNC), terra-luna
        repo.set("doge", 74); // Dogecoin (DOGE), dogecoin
        repo.set("ada", 2010); // Cardano (ADA), cardano
        repo.set("shib", 5994); // Shiba Inu (SHIB), shiba-inu
        repo.set("ape", 18876); // ApeCoin (APE), apecoin-ape
        repo.set("arb", 11841); // Arbitrum (ARB), arbitrum
        repo.set("ton", 11419); // Toncoin (TON), toncoin
        repo.set("wif", 28752); // dogwifhat (WIF), dogwifhat
        repo.set("pepe", 24478); // Pepe (PEPE), pepe
        repo.set("bnb", 1839); // BNB (BNB), bnb
        repo.set("bonk", 23095); // Bonk (BONK), bonk1
        repo.set("dogs", 33083); // Dogs (DOGS), dogs
        repo.set("floki", 10804); // FLOKI (FLOKI), floki-inu
        repo.set("uni", 7083); // Uniswap (UNI), uniswap
        repo.set("trump", 35336); // Official Trump (TRUMP), official-trump
        repo.set("jup", 29210); // Jupiter (JUP), jupiter-ag
        repo.set("move", 32452); // Movement (MOVE), movement
        repo.set("xlm", 512); // Stellar (XLM), rank 15, stellar
        repo.set("mana", 1966); // Decentraland (MANA), rank 155, decentraland
        repo.set("sand", 6210); // The Sandbox (SAND), rank 146, the-sandbox
        repo.set("dot", 6636); // Polkadot (DOT), rank 44, polkadot-new
        repo.set("avax", 5805); // Avalanche (AVAX), rank 28, avalanche
        repo.set("op", 11840); // Optimism (OP), rank 132, optimism-ethereum
        repo.set("apex", 19843); // ApeX Protocol (APEX), rank 520, apex-token
        repo.set("trx", 1958); // TRON (TRX), rank 8, tron
        repo.set("icp", 8916); // Internet Computer (ICP), rank 50, internet-computer
        repo.set("link", 1975); // Chainlink (LINK), rank 17, chainlink
        repo.set("gmt", 18069); // GMT (GMT), rank 643, green-metaverse-token
        repo.set("chz", 4066); // Chiliz (CHZ), rank 107, chiliz
        repo.set("ldo", 8000); // Lido DAO (LDO), rank 126, lido-dao
        repo.set("fil", 2280); // Filecoin (FIL), rank 72, filecoin
        repo.set("apt", 21794); // Aptos (APT), rank 77, aptos
        repo.set("hft", 22461); // Hashflow (HFT), rank 1018, hashflow
        repo.set("sui", 20947); // Sui (SUI), rank 26, sui
        repo.set("mnt", 27075); // Mantle (MNT), rank 38, mantle
        repo.set("wld", 13502); // Worldcoin (WLD), rank 39, worldcoin-org
        repo.set("sei", 23149); // Sei (SEI), rank 95, sei
        repo.set("zk", 24091); // ZKsync (ZK), rank 167, zksync
        repo.set("zro", 26997); // LayerZero (ZRO), rank 102, layerzero
        repo.set("not", 28850); // Notcoin (NOT), rank 455, notcoin
        repo.set("bch", 1831); // Bitcoin Cash (BCH), rank 22, bitcoin-cash
        repo.set("near", 6535); // NEAR Protocol (NEAR), rank 32, near-protocol
        repo.set("mew", 30126); // cat in a dogs world (MEW), rank 565, mew
        repo.set("kas", 20396); // Kaspa (KAS), rank 59, kaspa
        repo.set("ondo", 21159); // Ondo (ONDO), rank 41, ondo-finance
        repo.set("jasmy", 8425); // JasmyCoin (JASMY), rank 124, jasmy
        repo.set("atom", 3794); // Cosmos (ATOM), rank 55, cosmos
        repo.set("fet", 3773); // Artificial Superintelligence Alliance (FET), rank 86, artificial-superintelligence-alliance
        repo.set("brett", 29743); // Brett (Based) (BRETT), rank 362, based-brett
        repo.set("tia", 22861); // Celestia (TIA), rank 103, celestia
        repo.set("inj", 7226); // Injective (INJ), rank 75, injective
        repo.set("cati", 32966); // Catizen (CATI), rank 628, catizen
        repo.set("hmstr", 32195); // Hamster Kombat (HMSTR), rank 735, hamster-kombat
        repo.set("bbsol", 33834); // Bybit Staked SOL (BBSOL), rank 8061, bybit-staked-sol
        repo.set("swell", 24924); // Swell Network (SWELL), rank 1335, swell-network
        repo.set("algo", 4030); // Algorand (ALGO), rank 62, algorand
        repo.set("hbar", 4642); // Hedera (HBAR), rank 24, hedera
        repo.set("ena", 30171); // Ethena (ENA), rank 66, ethena
        repo.set("aave", 7278); // Aave (AAVE), rank 57, aave
        repo.set("render", 5690); // Render (RENDER), rank 60, render
        repo.set("crv", 6538); // Curve DAO Token (CRV), rank 93, curve-dao-token
        repo.set("eigen", 30494); // EigenCloud (EIGEN), rank 151, eigencloud
        repo.set("pol", 28321); // Polygon (prev. MATIC) (POL), rank 64, polygon-ecosystem-token
        repo.set("aixbt", 34103); // aixbt (AIXBT), rank 679, aixbt
        repo.set("ar", 5632); // Arweave (AR), rank 160, arweave
        repo.set("s", 32684); // Sonic (S), rank 189, sonic
        repo.set("stx", 4847); // Stacks (STX), rank 98, stacks
        repo.set("ens", 13855); // Ethereum Name Service (ENS), rank 134, ethereum-name-service
        repo.set("ordi", 25028); // ORDI (ORDI), rank 318, ordi
        repo.set("pyth", 28177); // Pyth Network (PYTH), rank 108, pyth-network
        repo.set("jto", 28541); // Jito (JTO), rank 109, jito
        repo.set("dydx", 28324); // dYdX (DYDX), rank 181, dydx-chain
        repo.set("icnt", 37070); // Impossible Cloud Network (ICNT), rank 425, impossible-cloud-network
        repo.set("towns", 37571); // Towns (TOWNS), rank 1083, towns
        repo.set("pump", 36507); // Pump.fun (PUMP), rank 80, pump-fun
        repo.set("h", 36922); // Humanity (H), rank 73, humanity-protocol
        repo.set("virtual", 29420); // Virtuals Protocol (VIRTUAL), rank 92, virtual-protocol
        repo.set("spx", 28081); // SPX6900 (SPX), rank 104, spx6900
        repo.set("2z", 38515); // DoubleZero (2Z), rank 117, doublezero
        repo.set("met", 38353); // Meteora (MET), rank 372, meteora
        repo.set("cc", 37263); // Canton (CC), rank 14, canton-network
        repo.set("ltc", 2);
        repo.set("strk", 22691);
    }

}


