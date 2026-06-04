export class ThinServiceWorkerController {

    private registration: ServiceWorkerRegistration | null = null;
    private hasReloaded = false;

    public onUpdateCallback?: () => void;
    public onActivatedCallback?: () => void;

    static async Create(swPath: string = 'sw.js') {
        const controller = new ThinServiceWorkerController();
        await controller.init(swPath);
        controller.onUpdateCallback = () => {

            const ok = confirm('New version available. Reload now?');
            if (ok) {
                controller.forceUpdateCheck();
            }
        };


        controller.onActivatedCallback = () => {
            console.log('App updated');
            // optional: avoid alert; prefer silent reload
        };
        return controller;
    }

    private constructor() { }

    private async init(swPath: string) {
        if (!('serviceWorker' in navigator)) return;

        this.registration = await navigator.serviceWorker.register(swPath);
        await navigator.serviceWorker.ready;
        this.registration.update();
        this.registerUpdateListeners();
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                setTimeout(this.forceLayoutRecalculation, 80);
            }
        });
    }

    private registerUpdateListeners() {
        if (!this.registration) return;

        this.registration.addEventListener('updatefound', () => {
            const newWorker = this.registration?.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.onUpdateAvailable();
                }
            });
        });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            this.onActivated();
        });
    }

    private onUpdateAvailable() {
        console.log('[SW] Update available');
        this.onUpdateCallback?.();
    }

    private onActivated() {
        console.log('[SW] Activated new version');

        if (this.hasReloaded) return;
        this.hasReloaded = true;

        this.onActivatedCallback?.();
        window.location.reload();
    }

    public async forceUpdateCheck() {
        await this.registration?.update();
    }

    public forceLayoutRecalculation() {
        // 1. Forțăm un reflow citind o proprietate geometrică de pe body/header
        // Acest lucru obligă Chrome să recalculeze pixelii instantaneu
        const bodyHeight = document.body.offsetHeight;

        // 2. Opțional: Putem forța un "repaint" adăugând și eliminând rapid o clasă 
        // sau un stil inline pe containerul Grid (body) sau pe header
        const body = document.body;
        if (body) {
            // Schimbăm imperceptibil stilul pentru a forța motorul grafic să redeseneze
            body.style.transform = 'translateZ(0.1px)';

            // Curățăm stilul imediat în următorul cadru de animație (asincron)
            requestAnimationFrame(() => {
                body.style.transform = '';
            });
        }
    }
}
