import { ScreenerSettings } from "./application/exports/ScreenerSettings";
import { WorkerCoreImplementation } from "./worker/WorkerCoreImplementation";

async function initCall(id: number): Promise<void> {
    try {
        var controller = await getController();
        var data = await controller.getDefaultSettings();
        var jsonData = data.toJson();
        _workerPostResolve(id, jsonData);
    } catch (err: any) {
        _workerPostReject(id, err);
    }
}

async function fetchCall(id: number, progressEventName: string, payload: any): Promise<void> {
    try {
        var controller = await getController();
        var settings = ScreenerSettings.fromJson(payload);
        var data = await controller.fetch(settings, (progress, message) => _workerPostEvent(id, progressEventName, { progress, message }));
        
        _workerPostResolve(id, data.serialize());
    } catch (err: any) {
        _workerPostReject(id, err);
    }
}

async function synchronizeCall(id: number, progressEventName: string, payload: any): Promise<void> {
    try {
        var controller = await getController();
        var data = await controller.synchronize((progress, message) => _workerPostEvent(id, progressEventName, { progress, message }));
        _workerPostResolve(id, data.serialize());
    } catch (err: any) {
        _workerPostReject(id, err);
    }
}

let controllerCore: WorkerCoreImplementation | null = null;
let controllerPromise: Promise<WorkerCoreImplementation> | null = null;

async function getController(): Promise<WorkerCoreImplementation> {
    if (controllerCore) {
        return Promise.resolve(controllerCore);
    }
    if (!controllerPromise) {
        controllerPromise = WorkerCoreImplementation.Create()
            .then(core => {
                controllerCore = core;
                return core;
            })
            .catch(err => {
                controllerPromise = null;
                throw err;
            });
    }
    return controllerPromise;
}


self.onmessage = (event: MessageEvent) => {
    console.log(`${WorkerCoreImplementation.name}::onmessage, ${JSON.stringify(event.data)}`);
    _workerHandleCalls(event);
}

async function _workerHandleCalls(event: MessageEvent<any>): Promise<void> {
    if (event.data.type !== 'call') {
        return;
    }
    switch (event.data.method) {
        case 'init': await initCall(event.data.id); break;
        case 'fetch': await fetchCall(event.data.id, 'fetch:progress', event.data.args); break;
        case 'synchronize': await synchronizeCall(event.data.id, 'synchronize:progress', event.data.args); break;
        default: break;
    }
}

function _workerPostResolve(anId: number, aPayload: any) {
    self.postMessage({ id: anId, type: 'resolve', payload: aPayload });
}

function _workerPostReject(anId: number, anError: any) {
    console.log(`${WorkerCoreImplementation.name}::_workerPostReject, ${JSON.stringify(anError)}`);
    self.postMessage({ id: anId, type: 'reject', error: anError?.message ?? String(anError) });
}

function _workerPostEvent(anId: number, aName: string, anEvent: any) {
    self.postMessage({ id: anId, type: 'event', payload: anEvent, name: aName });
}


