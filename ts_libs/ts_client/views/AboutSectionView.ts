import { ISection } from "./ISection";
import { ViewHelper } from "./ViewHelper";

export class AboutSectionView implements ISection {
    #root: HTMLElement;
    #footer: HTMLElement;
    #linkedinContactButton: HTMLButtonElement;
    title: string;
    id: string;

    constructor() {
        this.id = 'about';
        this.title = 'About';
        this.#root = ViewHelper.getHtmlElementOrThrow('about');
        this.#footer = ViewHelper.getHtmlElementOrThrow('footer-about');
        this.#linkedinContactButton = ViewHelper.getButtonOrThrow('footer-about-linkedin-button');
        const url = String.fromCharCode(
            104, 116, 116, 112, 115, 58, 47, 47, 119, 119, 119, 46,
            108, 105, 110, 107, 101, 100, 105, 110, 46, 99, 111, 109,
            47, 105, 110, 47, 103, 97, 98, 114, 105, 101, 108, 45,
            97, 112, 111, 115, 116, 111, 108, 47
        );
        this.#linkedinContactButton.addEventListener('click', () => {
            window.open(url, '_blank', 'noopener,noreferrer');
        });
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