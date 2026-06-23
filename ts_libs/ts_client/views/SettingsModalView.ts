import { ScreenerSettings } from "../../ts_worker/application/exports/ScreenerSettings";
import { MainModel } from "../models/MainModel";
import { ViewHelper } from "./ViewHelper";



export class SettingsModalView {
    #root: HTMLElement;
    #dismiss: HTMLButtonElement;
    #apply: HTMLButtonElement;
    #cancel: HTMLButtonElement;
    #parallelRequestsCount: HTMLInputElement;
    #maxPairsCount: HTMLInputElement;
    #exchangeInclusions: HTMLInputElement[] | null;
    #settings: ScreenerSettings | undefined;
    #includeExchangesArea: HTMLElement;
    #onSettingsChanged: ((settings: ScreenerSettings) => void) | null = null;

    constructor() {
        this.#root = ViewHelper.getHtmlElementOrThrow('settings-modal');
        this.#dismiss = ViewHelper.getButtonOrThrow('settings-modal-close');
        this.#apply = ViewHelper.getButtonOrThrow('settings-modal-apply');
        this.#cancel = ViewHelper.getButtonOrThrow('settings-modal-cancel');

        this.#parallelRequestsCount = ViewHelper.getHtmlInputElementOrThrow('settings-parallel-requests-count');
        this.#maxPairsCount = ViewHelper.getHtmlInputElementOrThrow('settings-maximum-pairs-count');
        this.#includeExchangesArea = ViewHelper.getHtmlElementOrThrow('settings-include-exchanges');
        this.#exchangeInclusions = null;
        this.#dismiss.onclick = () => this.hide();
        this.#cancel.onclick = () => this.hide();
        this.#apply.onclick = () => {
            const settingsFromView = this.tryGetUpdatedSettingsFromView();
            if (settingsFromView) {
                this.#onSettingsChanged?.(settingsFromView);
            }
            this.hide();
        };
    }

    private tryGetUpdatedSettingsFromView(): ScreenerSettings | undefined {
        if (!this.#settings) {
            throw new Error("Screener settings are undefined");
        }

        const updated = this.#settings.deepClone();
        updated.maximumPairsCountPerExchange = this.tryGetMaxPairsCount();
        updated.parallelRequestsCount = this.tryGetParallelRequestCount();
        const selectedExchanges = new Set(this.tryGetSelectedExchanges());
        updated.exchangeInclusionCriterias.forEach(criteria => {
            criteria.include = selectedExchanges.has(criteria.name);
        });
        if (updated.deepEquals(this.#settings)) {
            return undefined;
        }
        return updated;
    }

    private tryGetMaxPairsCount(): number {
        const maxPairsCount = Number.parseInt(this.#maxPairsCount.value);
        return maxPairsCount;
    }

    private tryGetParallelRequestCount(): number {
        const parallelRequestsCount = Number.parseInt(this.#parallelRequestsCount.value);
        return parallelRequestsCount;
    }

    private tryGetSelectedExchanges(): string[] {
        if (!this.#exchangeInclusions) {
            throw new Error(`exchangeInclusions is not defined`);
        }
        let names: string[] = [];
        this.#exchangeInclusions.forEach(elem => {
            if (true === elem.checked) {
                const name = elem.getAttribute("data-exchange-name");
                if (name !== null) {
                    names.push(name);
                }
            }
        });
        return names;
    }

    public bindSettingsChanged(callback: (settings: ScreenerSettings) => void): void {
        this.#onSettingsChanged = callback;
    }

    public show(): void {
        ViewHelper.setModalState(true);
        ViewHelper.toggleVisibility(this.#root, true);
    }

    public hide(): void {
        ViewHelper.toggleVisibility(this.#root, false);
        ViewHelper.setModalState(false);
    }



    public update(model: MainModel): void {
        this.#settings = model.getScreenerSettingsOrThrow().deepClone();
        this.#parallelRequestsCount.value = this.#settings.parallelRequestsCount.toString();
        this.#maxPairsCount.value = this.#settings.maximumPairsCountPerExchange.toString();
        this.#includeExchangesArea.innerHTML = "";
        this.#exchangeInclusions = [];
        this.#settings.exchangeInclusionCriterias.forEach(criteria => {
            var cb = document.createElement('input');
            cb.setAttribute("type", "checkbox");
            cb.setAttribute("data-exchange-name", criteria.name);
            cb.checked = criteria.include;

            var slider = document.createElement('span');
            slider.classList.add('checkbox-slider');

            var text = document.createElement('span');
            text.classList.add('checkbox-text');
            text.textContent = criteria.name;

            var label = document.createElement('label');
            label.classList.add('checkbox-label');

            label.appendChild(cb);
            label.appendChild(slider);
            label.appendChild(text);

            this.#includeExchangesArea.appendChild(label);
            this.#exchangeInclusions?.push(cb);
        });
    }
}