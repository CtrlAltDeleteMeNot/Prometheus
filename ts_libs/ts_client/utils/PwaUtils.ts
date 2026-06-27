export class PwaUtils {
    public static isInstalled(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone === true;
    }

    public static isWakeLockSupported(): boolean{
        return "wakeLock" in navigator;
    }
}