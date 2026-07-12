import { MainView } from '../views/MainView';
import { MainModel } from '../models/MainModel';
import { SortDirection } from '../../ts_worker/application/exports/SortDirection';
import { TradingPairModel } from '../../ts_worker/application/exports/TradingPairModel';
import { ScreenerSettings, ScreenerSettingsDto } from '../../ts_worker/application/exports/ScreenerSettings';
import { ISection } from '../views/ISection';
import { NamedAttributeMetadata } from '../../ts_worker/application/exports/NamedAttribute';
import { SynchronizationModel, SynchronizationModelDto } from '../../ts_worker/application/exports/SynchronizationModel';

type Pending = {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
};
type WorkerEventHandler<T = any> = (payload: T) => void;


export class ThinController {

    static async Create(workerPath: string) {
        let mainModel = new MainModel();
        let mainView = new MainView(mainModel);
        let worker = new Worker(workerPath);
        var toReturn = new ThinController(mainModel, mainView, worker);
        await toReturn.initialize();
        return toReturn;
    }
    #mainView: MainView;
    #mainModel: MainModel;
    #worker: Worker;
    #promises: Map<number, Pending>;
    #id: number;
    #eventHandlers: Map<string, Set<WorkerEventHandler>>;

    constructor(model: MainModel, view: MainView, worker: Worker) {
        this.#mainView = view;
        this.#mainModel = model;
        this.#worker = worker;
        this.#worker.onmessage = (e) => this.onWorkerMessage(e.data);
        this.#mainView.startSection.bindStartAction(async () => await this.fetch());
        this.#mainView.startSection.bindSettingsAction(() => this.showSettingsModal());
        this.#mainView.startSection.disableActions(true);
        this.#mainView.screenerSection.bindSynchronizationRequested(() => this.synchronize());
        this.#mainView.screenerSection.bindSortButton(() => this.showSortModal());
        this.#mainView.screenerSection.bindFilterButton(() => this.showFilterModal());
        this.#mainView.signalsSection.bindSynchronizationRequested(() => this.synchronize());
        this.#mainView.navigation.bindShowSectionAction((aPageName) => this.showSection(aPageName));
        this.#mainView.sortModalView.bindSortingRulesChanged((direction, sortKey) => this.doSort(direction, sortKey));
        this.#mainView.filterModalView.bindFilteringRulesChanged((rules) => this.doFilter(rules));
        this.#mainView.settingsModalView.bindSettingsChanged((aSettings) => this.applySettings(aSettings));
        this.#promises = new Map<number, Pending>();
        this.#eventHandlers = new Map<string, Set<WorkerEventHandler>>();
        this.#id = 0;
    }

    showUpdateInfo(title: string, message: string) {
        console.log(`${ThinController.name}::${this.showUpdateInfo.name} -> title: ${title}, message:${message}`)
    }


    showSection(aPageName: string): ISection {
        var section = this.#mainView.findSectionById(aPageName);
        this.#mainView.showSection(section);
        return section;
    }

    showFilterModal(): void {
        this.#mainView.filterModalView.update(this.#mainModel);
        this.#mainView.filterModalView.show();
    }

    showSortModal(): void {
        this.#mainView.sortModalView.update(this.#mainModel);
        this.#mainView.sortModalView.show();
    }

    showSettingsModal(): void {
        this.#mainView.settingsModalView.update(this.#mainModel);
        this.#mainView.settingsModalView.show();
    }

    doFilter(activeFilters: NamedAttributeMetadata[]): void {
        const data = this.#mainModel.getMultiTimeFrameSnapshot();
        const direction = this.#mainModel.getSortDirection();
        const key = this.#mainModel.getSortNamedAttributeMetadata().key;
        const sorted = ThinController.doFilteringAndSortingCore(data, direction, key, activeFilters);

        this.#mainModel.setActiveFilterableAttributes(activeFilters);
        this.#mainView.screenerSection.setData(sorted);
        this.#mainView.navigation.update(this.#mainModel);
    }

    doSort(sortDirection: SortDirection, key: string): void {
        const data = this.#mainModel.getMultiTimeFrameSnapshot();
        const metadata = this.#mainModel.getSortableAttributes().find(s => s.key === key);
        if (metadata === undefined) {
            return;
        }

        const sorted = ThinController.doFilteringAndSortingCore(data, sortDirection, key, this.#mainModel.getActiveFilterableAttributes());
        this.#mainModel.setSortDirection(sortDirection);
        this.#mainModel.setSortNamedAttributeMetadata(metadata);
        this.#mainView.screenerSection.setData(sorted);
        this.#mainView.navigation.update(this.#mainModel);
    }

    static doFilteringAndSortingCore(data: readonly TradingPairModel[], direction: SortDirection, key: string, filters: NamedAttributeMetadata[] | undefined): readonly TradingPairModel[] {
        const filtered = !filters || filters.length === 0
            ? data
            : data.filter(tp => {

                const tradingPairTrueAttributes = tp
                    .getAttributes()
                    .filter(attr => attr.value === true)
                    .map(attr => attr.metadata.key);

                return filters.every(filter =>
                    tradingPairTrueAttributes.includes(filter.key)
                );
            });


        const dir = direction === SortDirection.Ascending ? 1 : -1;
        const sorted = filtered.slice().sort((a, b) => {
            let aValue = a.getAttr(key);
            let bValue = b.getAttr(key);
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return -1 * dir;
            if (bValue == null) return 1 * dir;
            return aValue.compare(bValue) * dir;
        });
        return sorted;
    }

    async initialize(): Promise<void> {
        try {
            const rawResponse = await this.callWorker('init') as ScreenerSettingsDto;
            const settings = ScreenerSettings.deserialize(rawResponse);
            try {
                settings.reconcile();
            } catch (err) {
                console.log(err);
            }
            finally {
                this.#mainModel.setScreenerSettings(settings);
                this.#mainView.startSection.disableActions(false);
            }
        } catch (err) {
            this.#mainView.genericModalView.showError("Error", "Application initialzation failure, please restart.", err, () => { });
        }
    }

    applySettings(aSettings: ScreenerSettings) {
        this.#mainModel.setScreenerSettings(aSettings);
        aSettings.persist();
    }

    async fetch(): Promise<void> {

        const settings = this.#mainModel.getScreenerSettingsOrThrow();
        this.#mainView.progressModalView.show('Fetching market data ...');
        try {
            const handler: WorkerEventHandler<any> = (data) => this.#mainView.progressModalView.updateProgressFromWorker(data);
            this.on("fetch:progress", handler);
            const response = await this.callWorker('fetch', settings.serialize()) as SynchronizationModelDto;
            this.off("fetch:progress", handler);
            const responseModel = SynchronizationModel.deserialize(response);
            const sortDirection = SortDirection.Descending;
            const sortFieldMetadata = settings.sortableAttributes[1];
            const sorted = ThinController.doFilteringAndSortingCore(responseModel.tradingPairs, sortDirection, sortFieldMetadata.key, this.#mainModel.getActiveFilterableAttributes());
            this.#mainModel.appendSignals(responseModel.signals);
            this.#mainModel.setSortableAttributes(settings.sortableAttributes);
            this.#mainModel.setFilterableAttributes(settings.filterableAttributes);
            this.#mainModel.setMultiTimeFrameSnapshot(sorted);
            this.#mainModel.setSortDirection(sortDirection);
            this.#mainModel.setSortNamedAttributeMetadata(sortFieldMetadata);
            this.#mainView.screenerSection.setData(sorted);
            this.#mainView.signalsSection.setData(this.#mainModel.getSignals());
            this.#mainView.sortModalView.update(this.#mainModel);
            this.#mainView.filterModalView.update(this.#mainModel);
            this.#mainView.progressModalView.hide();
            this.#mainView.screenerSection.show();
            this.#mainView.navigation.update(this.#mainModel);
            this.#mainView.navigation.show();
        } catch (err) {
            this.#mainView.progressModalView.hide();
            this.#mainView.genericModalView.showError("Error", "Application data fetch failure, please restart.", err, () => { this.restartApp(); });
        }
    }

    async synchronize() {
        if (this.#mainView.progressModalView.isVisible) {
            return;
        }
        this.#mainView.progressModalView.show('Synchronizing market data ...');
        try {
            const handler: WorkerEventHandler<any> = (data) => this.#mainView.progressModalView.updateProgressFromWorker(data);
            this.on("synchronize:progress", handler);
            const rawResponse = await this.callWorker('synchronize', this.#mainModel.getScreenerSettings()?.serialize()) as SynchronizationModelDto;
            this.off("synchronize:progress", handler);
            const synchronizationModel = SynchronizationModel.deserialize(rawResponse);
            if (synchronizationModel.tradingPairs.length > 0) {
                const sorted = ThinController.doFilteringAndSortingCore(synchronizationModel.tradingPairs, this.#mainModel.getSortDirection(), this.#mainModel.getSortNamedAttributeMetadata().key, this.#mainModel.getActiveFilterableAttributes());
                this.#mainModel.setMultiTimeFrameSnapshot(synchronizationModel.tradingPairs);
                this.#mainModel.appendSignals(synchronizationModel.signals);
                this.#mainView.screenerSection.setData(sorted);
                this.#mainView.signalsSection.setData(this.#mainModel.getSignals());
            }
            this.#mainView.progressModalView.hide();
        } catch (err) {
            this.#mainView.progressModalView.hide();
            this.#mainView.genericModalView.showError("Error", "Application data sync failure, please restart.", err, () => { this.restartApp(); });
        }
    }

    private restartApp(): void {
        // Dispose resources if needed
        this.#worker.terminate();

        // Reload the PWA
        window.location.reload();
    }

    private callWorker(method: string, args?: any): Promise<any> {
        const id = ++this.#id;
        const message = { id, type: 'call', method, args };
        this.postWorkerMessage(message);
        return new Promise((resolve, reject) => {
            this.#promises.set(id, { resolve, reject });
        });
    }

    private postWorkerMessage(message: any) {
        //console.log(`${ThinController.name}::${this.postWorkerMessage.name}, ${JSON.stringify(message)}`);
        this.#worker.postMessage(message);
    }

    private onWorkerMessage(msg: any) {
        //console.log(`${ThinController.name}::${this.onWorkerMessage.name}, ${JSON.stringify(msg)}`);
        if (msg.type === 'resolve' || msg.type === 'reject') {
            const pending = this.#promises.get(msg.id);
            if (!pending) return;

            this.#promises.delete(msg.id);

            msg.type === 'resolve'
                ? pending.resolve(msg.payload)
                : pending.reject(new Error(msg.error));

            return;
        }

        // Progress / events
        if (msg.type === 'event') {
            const handlers = this.#eventHandlers.get(msg.name);
            if (!handlers) return;
            handlers.forEach(h => h(msg.payload));
        }
    }

    on(eventName: string, handler: WorkerEventHandler): void {
        if (!this.#eventHandlers.has(eventName)) {
            this.#eventHandlers.set(eventName, new Set());
        }
        this.#eventHandlers.get(eventName)!.add(handler);
    }

    off(eventName: string, handler: WorkerEventHandler): void {
        this.#eventHandlers.get(eventName)?.delete(handler);
    }

}



