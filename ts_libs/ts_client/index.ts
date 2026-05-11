import { ThinController } from './controllers/ThinController';


document.addEventListener('DOMContentLoaded', async () => {
    let controller = await ThinController.Create('js/worker/worker.js').catch(console.error);
});