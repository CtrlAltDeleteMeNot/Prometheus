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
        this.#percentText.textContent = '0%';
        this.#percentLine.style.width = `0%`;
        ViewHelper.toggleVisibility(this.#root, true);
    }

    public hide(): void {
        ViewHelper.toggleVisibility(this.#root, false);
        this.#body.innerHTML = '';
    }

    public updateProgress(percent: number, message: string): void {
        this.#percentText.textContent = `${Math.round(percent)}%`;
        this.#percentLine.style.width = `${percent}%`;
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        this.#body.appendChild(paragraph);
        
        this.#body.scrollTo({
            top: this.#body.scrollHeight,
            behavior: 'smooth'
        });

    }

    public updateProgressFromWorker(data: any): void {
        this.updateProgress(data.progress, data.message);
    }
}