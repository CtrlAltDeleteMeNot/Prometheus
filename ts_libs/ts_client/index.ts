import { CLSMonitor } from './controllers/ClsMonitor';
import { ThinController } from './controllers/ThinController';
import { ThinServiceWorkerController } from './controllers/ThinServiceWorkerController';

document.addEventListener('DOMContentLoaded', async () => {
    //CLSMonitor.Create();
    await ThinServiceWorkerController.Create('sw.js').catch(console.error);
    await ThinController.Create('js/worker/worker.js').catch(console.error);
});