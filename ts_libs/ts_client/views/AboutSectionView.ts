import { ISection } from "./ISection";
import { ViewHelper } from "./ViewHelper";

export class AboutSectionView implements ISection{
    #root: HTMLElement;
    title: string;
    id: string;

    constructor(){
        this.id = 'about';
        this.title = 'About';
        this.#root = ViewHelper.getHtmlElementOrThrow('about');
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
}