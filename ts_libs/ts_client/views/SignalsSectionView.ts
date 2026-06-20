import { ISection } from "./ISection";
import { ViewHelper } from "./ViewHelper";

export class SignalSectionView implements ISection {
    #root: HTMLElement;
    #footer: HTMLElement;
    title: string;
    id: string;

    constructor() {
        this.id = 'signals';
        this.title = 'Signals';
        this.#root = ViewHelper.getHtmlElementOrThrow('signals');
        this.#footer = ViewHelper.getHtmlElementOrThrow('footer-signals');
    }

    hasExternalActions(): boolean {
        return true;
    }


    public show() {
        ViewHelper.toggleVisibility(this.#root, true);
        ViewHelper.toggleVisibility(this.#footer, true);
    }

    public hide() {
        ViewHelper.toggleVisibility(this.#root, false);
        ViewHelper.toggleVisibility(this.#footer, false);
    }
}