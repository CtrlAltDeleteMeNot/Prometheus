import { ISection } from "./ISection";
import { ViewHelper } from "./ViewHelper";

export class StartSectionView implements ISection {
    #root: HTMLElement;
    #startButton: HTMLButtonElement;
    #settingsButton: HTMLButtonElement;
    title: string;
    id: string;


    constructor() {
        this.title = "Start";
        this.id = "start";
        this.#root = ViewHelper.getHtmlElementOrThrow(this.id);
        this.#startButton = ViewHelper.getButtonOrThrow('start-btn');
        this.#settingsButton = ViewHelper.getButtonOrThrow('settings-btn');
    }

    hasExternalActions(): boolean {
        return false;
    }

    public show() {
        this.#root.classList.remove('d-none');
    }

    public hide() {
        this.#root.classList.add('d-none');
    }

    public disableActions(disabled:boolean):void{
        this.#startButton.disabled = disabled;
        this.#settingsButton.disabled = disabled;
    }


    bindStartAction(callback: () => void | Promise<void>): void {
        this.#startButton.addEventListener('click', async (event) => {
            this.#startButton.setAttribute('disabled', 'true');
            try {
                await callback();
            } finally {
                this.#startButton.removeAttribute('disabled');
                this.hide();
            }
        });
    }

    bindSettingsAction(callback: () => void | Promise<void>): void {
        this.#settingsButton.addEventListener('click', async (event) => {
            await callback();
        });
    }
}