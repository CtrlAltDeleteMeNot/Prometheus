export class ThinServiceWorkerController {

    private registration: ServiceWorkerRegistration | null = null;

    static async Create(swPath: string = 'sw.js') {
        const controller = new ThinServiceWorkerController();
        await controller.init(swPath);
        return controller;
    }

    private constructor() { }

    private async init(swPath: string) {
        if (!('serviceWorker' in navigator)) {
            return;
        }

        this.registration = await navigator.serviceWorker.register(swPath);

        // Immediately check for updates
        this.registration.update();

        this.registerUpdateListeners();
    }

    private registerUpdateListeners() {
        if (!this.registration) return;

        // Detect new SW installation
        this.registration.addEventListener('updatefound', () => {
            const newWorker = this.registration?.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {

                    // A new version is ready
                    if (navigator.serviceWorker.controller) {
                        this.onUpdateAvailable();
                    }
                }
            });
        });

        // Activated new SW
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            this.onActivated();
        });
    }

    private onUpdateAvailable() {
        console.log('[SW] Update available');
        const shouldReload = window.confirm(
            'A new version is available. Reload now?'
        );

        if (shouldReload) {
            this.registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
        }
    }

    private onActivated() {
        console.log('[SW] Activated new version');
        window.alert('App updated. Reloading...');
        window.location.reload();
    }

    public async forceUpdateCheck() {
        await this.registration?.update();
    }
}