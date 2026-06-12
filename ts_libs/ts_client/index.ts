import { CLSMonitor } from './controllers/ClsMonitor';
import { ThinController } from './controllers/ThinController';
import { ServiceWorkerController } from './controllers/ServiceWorkerController';

//viewport stuff
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

document.addEventListener('DOMContentLoaded', async () => {
    const [swResult, appResult] = await Promise.allSettled([
        ServiceWorkerController.Create('sw.js'),
        ThinController.Create('js/worker/worker.js')
    ]);

    if (swResult.status === 'rejected') {
        console.error('ServiceWorker startup failed', swResult.reason);
    }

    if (appResult.status === 'rejected') {
        console.error('Application startup failed', appResult.reason);
    }

    const sw = swResult.status === 'fulfilled'
        ? swResult.value
        : undefined;

    const app = appResult.status === 'fulfilled'
        ? appResult.value
        : undefined;

    if (!sw || !app) {
        console.error('sw or app undefined');
        return;
    }

    if (ServiceWorkerController.WasUpdated()) {
        app.showUpdateInfo("Updated", "Application was updated to a new version.");
    }

    if (sw) {
        //During startup: update may reload the app.
        //After startup: no update listener remains, so users are not interrupted.
        await sw.forceUpdateCheck();
        sw.dispose();
    }
});


function fixVieport(): void {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
    });
}

window.addEventListener("pageshow", (_event: PageTransitionEvent) => {
    console.log(`${PageTransitionEvent.name}: ${_event}`)
    fixVieport();
});


