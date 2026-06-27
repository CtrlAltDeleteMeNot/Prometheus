import { ViewHelper } from "./ViewHelper";

export class ProgressModalView {
    #root: HTMLElement;
    #title: HTMLElement;
    #percentText: HTMLElement;
    #percentLine: HTMLElement;
    #body: HTMLElement;

    constructor() {
        this.#root = ViewHelper.getHtmlElementOrThrow('progress-modal');
        this.#title = ViewHelper.getHtmlElementOrThrow('progress-modal-title');
        this.#percentText = ViewHelper.getHtmlElementOrThrow('progress-modal-progress-percent-text');
        this.#percentLine = ViewHelper.getHtmlElementOrThrow('progress-modal-progress-percent-line');
        this.#body = ViewHelper.getHtmlElementOrThrow('progress-modal-body');
    }

    public show(title: string): void {
        this.#title.textContent = title;
        this.#body.innerHTML = '';
        this.#percentText.textContent = '0 %';
        this.#percentLine.style.transform = `scaleX(0)`;
        ViewHelper.setModalState(true);
        ViewHelper.toggleVisibility(this.#root, true);
    }

    public hide(): void {
        ViewHelper.toggleVisibility(this.#root, false);
        ViewHelper.setModalState(false);
        this.#body.innerHTML = '';
    }

    public get isVisible(): boolean {
        return ViewHelper.isVisible(this.#root);
    }

    public updateProgress(percent: number, message: string): void {
        const scale = percent / 100;
        const percentValue = percent.toFixed(0);
        requestAnimationFrame(() => {
            this.#percentText.textContent = `${percentValue} %`;
            this.#percentLine.style.transform = `scaleX(${scale})`;
            const paragraph = document.createElement('p');
            paragraph.textContent = message;
            this.#body.appendChild(paragraph);
            this.#body.scrollTop = this.#body.scrollHeight;
        });

    }

    public updateProgressFromWorker(data: any): void {
        this.updateProgress(data.progress, data.message);
    }
}