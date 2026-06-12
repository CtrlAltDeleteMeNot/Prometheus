export class ServiceWorkerController {
    private hasReloaded = false;

    public static readonly UPDATED_QUERY_PARAM = "updated";

    public static async Create(
        swPath: string = "sw.js"
    ): Promise<ServiceWorkerController | undefined> {
        if (!("serviceWorker" in navigator)) {
            return undefined;
        }

        const registration = await navigator.serviceWorker.register(swPath);
        await navigator.serviceWorker.ready;

        const controller = new ServiceWorkerController(registration);
        controller.registerUpdateListeners();

        return controller;
    }

    private constructor(
        private readonly registration: ServiceWorkerRegistration
    ) { }

    private readonly onControllerChange = (): void => {
        this.reloadAfterActivation();
    };

    private readonly onUpdateFound = (): void => {
        const worker = this.registration.installing;
        if (!worker) return;

        worker.addEventListener("statechange", () => {
            if (
                worker.state === "installed" &&
                navigator.serviceWorker.controller
            ) {
                console.log("[SW] Update installed during startup");
            }
        });
    };

    private registerUpdateListeners(): void {
        this.registration.addEventListener("updatefound", this.onUpdateFound);
        navigator.serviceWorker.addEventListener("controllerchange", this.onControllerChange);
    }

     public disableUpdateChecks(): void {
        this.registration.removeEventListener("updatefound", this.onUpdateFound);
        navigator.serviceWorker.removeEventListener("controllerchange", this.onControllerChange);
    }

    private reloadAfterActivation(): void {
        if (this.hasReloaded) {
            return;
        }

        this.hasReloaded = true;

        const url = new URL(window.location.href);
        url.searchParams.set(
            ServiceWorkerController.UPDATED_QUERY_PARAM,
            "1"
        );

        window.location.replace(url.toString());
    }

    public static WasUpdated(): boolean {
        const url = new URL(window.location.href);

        if (
            url.searchParams.get(
                ServiceWorkerController.UPDATED_QUERY_PARAM
            ) !== "1"
        ) {
            return false;
        }

        url.searchParams.delete(
            ServiceWorkerController.UPDATED_QUERY_PARAM
        );

        history.replaceState(
            {},
            document.title,
            url.pathname + url.search + url.hash
        );

        return true;
    }

    public async forceUpdateCheck(): Promise<void> {
        await this.registration.update();
    }

   
}