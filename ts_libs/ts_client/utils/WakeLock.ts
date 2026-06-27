import { Logger, TaggedLogger } from "./Logger";
import { PwaUtils } from "./PwaUtils";

export class WakeLock {
    #wakeLockSentinel: WakeLockSentinel | undefined;
    #logger: TaggedLogger;

    public constructor() {
        this.#wakeLockSentinel = undefined;
        this.#logger = Logger.create(WakeLock);
    }

    public acquire(): void {
        if (!this.canAcquire()) {
            return;
        }
        navigator.wakeLock
            .request('screen')
            .then(wakeLockSentinel => this.assignWakeLockSentinel(wakeLockSentinel))
            .catch(error => this.#logger.warn(error));
    }

    public release(): void {
        if (!this.#wakeLockSentinel || !this.isHeld) {
            return;
        }
        this.#wakeLockSentinel
            .release()
            .catch(error => this.#logger.warn(error))
            .finally(() => this.#wakeLockSentinel = undefined);
    }

    private canAcquire(): boolean {
        return (
            PwaUtils.isInstalled() &&
            PwaUtils.isWakeLockSupported() &&
            !this.isHeld
        );
    }

    private assignWakeLockSentinel(sentinel: WakeLockSentinel): void {
        this.#logger.info("Wake lock acquired");
        this.#wakeLockSentinel = sentinel;
        sentinel.onrelease = () => {
            this.#logger.info("Wake lock released.");
            this.#wakeLockSentinel = undefined;
        };
    }

    public get isHeld(): boolean {
        return this.#wakeLockSentinel !== undefined && this.#wakeLockSentinel.released === false;
    }

    
}