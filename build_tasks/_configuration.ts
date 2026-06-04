type ConfigurationOptions = {
    app: string;
    localDevPort: number;
    manifest_start_url: string,
    manifest_scope: string,
    manifest_id: string,
    isDevelopmentVersion: boolean;
};

export class Configuration {
    readonly app: string;
    readonly localDevPort: number;
    readonly manifest_start_url: string;
    readonly manifest_scope: string;
    readonly manifest_id: string;
    readonly isDevelopmentVersion: boolean;

    readonly html: {
        input: string;
        outputHtmlFile: string;
        outputJsWorker: string;
        outputDir: string;
        watch: string;
    };
    readonly esClientJs: {
        input: string;
        output: string;
        outputDir: string;
        watch: string;
    };
    readonly esWorkerJs: {
        input: string;
        output: string;
        outputDir: string;
        watch: string;
    };
    readonly esClientCss: {
        input: string;
        output: string;
        outputDir: string;
        watch: string;
    };
    readonly symbolIconsSvgs: {
        inputDir: string;
        outputRegistryTsFile: string;
        relativeUrlPrefix: string;
        outputDir: string;
    };
    readonly actionIconsSvgs: {
        inputDir: string;
        lookup: string[];
        outputRegistryTsFile: string;
        relativeUrlPrefix: string;
        outputDir: string;
    };
    readonly manifestPath: string;
    readonly imagesDestPath: string;
    readonly imagesSourcePath: string;

    public constructor(opts: ConfigurationOptions) {
        this.app = opts.app;
        this.localDevPort = opts.localDevPort;
        this.manifest_start_url = opts.manifest_start_url;
        this.manifest_scope = opts.manifest_scope;
        this.manifest_id = opts.manifest_id;
        this.isDevelopmentVersion = opts.isDevelopmentVersion;
        this.html = {
            input: 'html/index.html',
            outputHtmlFile: `${this.app}index.html`,
            outputJsWorker: `${this.app}sw.js`,
            outputDir: `${this.app}`,
            watch: 'html/**/*.html'
        };
        this.esClientJs = {
            input: 'ts_libs/ts_client/index.ts',
            output: `${this.app}js/client/bundle.js`,
            outputDir: `${this.app}js/client/`,
            watch: 'ts_libs/ts_client/**/*.ts'
        };
        this.esWorkerJs = {
            input: 'ts_libs/ts_worker/index.ts',
            output: `${this.app}js/worker/worker.js`,
            outputDir: `${this.app}js/worker/`,
            watch: 'ts_libs/ts_worker/**/*.ts'
        };
        this.esClientCss = {
            input: 'ts_libs/es_css/index.css',
            output: `${this.app}css/client/bundle.css`,
            outputDir: `${this.app}css/client/`,
            watch: 'ts_libs/es_css/**/*.css'
        };
        this.manifestPath = `${this.app}manifest.json`;
        this.imagesDestPath = `${this.app}img/`;
        this.imagesSourcePath = './images/**/*';
        this.symbolIconsSvgs = {
            inputDir: 'node_modules/cryptocurrency-icons/svg/color/',
            outputDir: `${opts.app}img/symbols/`,
            outputRegistryTsFile: 'ts_libs/ts_client/views/generated/SymbolIconsRegistry.ts',
            relativeUrlPrefix: "img/symbols/"
        };
        this.actionIconsSvgs = {
            inputDir: 'node_modules/lineicons/assets/svgs/regular/',
            lookup: ['menu-hamburger-1', 'refresh-circle-1-clockwise', 'xmark', 'funnel-1', 'sort-high-to-low', 'arrow-right', 'minus-circle'],
            outputRegistryTsFile: 'ts_libs/ts_client/views/generated/ActionIconsRegistry.ts',
            outputDir: `${opts.app}img/actions/`,
            relativeUrlPrefix: "/img/actions/"
        };
    }



    get manifest() {
        return {
            "name": this.isDevelopmentVersion ? "Prometheus.DEV" : "Prometheus",
            "short_name": this.isDevelopmentVersion ? "Prometheus.DEV" : "Prometheus",
            "description": "Prometheus is the ultimate companion for crypto traders focused on USDC pairs.",
            "icons": [
                {
                    "src": `${this.manifest_scope}img/logo-192x192.png`,
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": `${this.manifest_scope}img/logo-512x512.png`,
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ],
            "categories": ["productivity", "utilities", "financial"],
            "display": "fullscreen",
            "background_color": "#0b0f1a",
            "theme_color": "#0b0f1a",
            "orientation": "portrait",
            "lang": "en-US",
            "start_url": this.manifest_start_url,
            "scope": this.manifest_scope,
            "id": this.manifest_id,
        }
    }
};

export const developmentConfiguration = new Configuration({ app: './app/', isDevelopmentVersion: true, localDevPort: 9000, manifest_start_url: "http://localhost:9000/", manifest_scope: "http://localhost:9000/", manifest_id: "Prometheus.DEV" });
export const publishConfiguration = new Configuration({ app: './docs/', isDevelopmentVersion: false, localDevPort: 9000, manifest_start_url: "https://ctrlaltdeletemenot.github.io/Prometheus/", manifest_scope: "https://ctrlaltdeletemenot.github.io/Prometheus/", manifest_id: "Prometheus" });