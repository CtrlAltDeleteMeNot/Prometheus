import { ScreenerSettings } from "../../ts_worker/application/exports/ScreenerSettings";
import { ExchangeInclusionCriteria } from "../../ts_worker/application/exports/settings/ExchangeInclusionCriteria";
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
            const settingsFromView = this.tryGetSettingsFromView();
            if (this.#settings && !settingsFromView.deepEquals(this.#settings)) {
                if (this.#onSettingsChanged) {
                    this.#onSettingsChanged(settingsFromView);
                }
            }
            this.hide();
        };
    }

    private tryGetSettingsFromView(): ScreenerSettings {
        const criterias = this.tryGetExchangeInclusionCriterias();
        const settings = new ScreenerSettings(criterias);
        settings.maximumPairsCountPerExchange = this.tryGetMaxPairsCount();
        settings.parallelRequestsCount = this.tryGetParallelRequestCount();
        return settings;
    }



    private tryGetMaxPairsCount(): number {
        const maxPairsCount = Number.parseInt(this.#maxPairsCount.value);
        return maxPairsCount;
    }

    private tryGetParallelRequestCount(): number {
        const parallelRequestsCount = Number.parseInt(this.#parallelRequestsCount.value);
        return parallelRequestsCount;
    }

    private tryGetExchangeInclusionCriterias(): ExchangeInclusionCriteria[] {
        if (!this.#exchangeInclusions) {
            throw new Error(`exchangeInclusions is not defined`);
        }
        if (!this.#settings) {
            throw new Error(`settings is not defined`);
        }
        var clonedCriterias = this.#settings.exchangeInclusionCriterias.map(e => e.deepClone());
        clonedCriterias.forEach(c => {
            var found = this.#exchangeInclusions?.find(e => c.name === e.getAttribute("data-exchange-name"));
            if (found) {
                c.include = found.checked;
            }
        });
        return clonedCriterias;
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
        this.#settings = model.getScreenerSettings()?.deepClone();

        if (undefined === this.#settings) {
            throw new Error("MainModel does not have ScreenerSettings");
        }
        this.#parallelRequestsCount.value = this.#settings.parallelRequestsCount.toString();
        this.#maxPairsCount.value = this.#settings.maximumPairsCountPerExchange.toString();
        this.#includeExchangesArea.innerHTML = "";
        this.#exchangeInclusions = [];
        this.#settings.exchangeInclusionCriterias.forEach(criteria => {
            var cb = document.createElement('input');
            cb.setAttribute("type", "checkbox");
            cb.setAttribute("data-exchange-name", criteria.name);
            cb.checked = criteria.include;
            var label = document.createElement('label');
            label.classList.add('checkbox-label');
            label.appendChild(cb);
            label.appendChild(document.createTextNode(criteria.name));
            this.#includeExchangesArea.appendChild(label);
            this.#exchangeInclusions?.push(cb);
        });
    }
}