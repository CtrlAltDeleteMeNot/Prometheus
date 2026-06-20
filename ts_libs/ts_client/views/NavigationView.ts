import { SortDirection } from "../../ts_worker/application/exports/SortDirection";
import { MainModel } from "../models/MainModel";
import { ISection } from "./ISection";
import { ViewHelper } from "./ViewHelper";

export class NavigationView {
    #sidebar: HTMLElement;
    #header: HTMLElement;
    #headerSectionName : HTMLElement;
    #footer: HTMLElement;
    #expandAction: HTMLButtonElement;
    #collapseAction: HTMLButtonElement;
    
    #sortActionMainText: HTMLSpanElement;
    #sortActionSubText: HTMLSpanElement;
    #sortActionImage: HTMLElement;

    #showPageSignalsAction: HTMLAnchorElement;
    #showPageScreenerAction: HTMLAnchorElement;
    #showPageAboutAction: HTMLAnchorElement;

    constructor() {
        this.#sidebar = ViewHelper.getHtmlElementOrThrow('nav-sidebar');
        this.#header = ViewHelper.getHtmlElementOrThrow('nav-header');
        this.#headerSectionName = ViewHelper.getHtmlElementOrThrow('current-section');
        this.#footer = ViewHelper.getHtmlElementOrThrow('nav-footer');
       
        this.#expandAction = ViewHelper.getButtonOrThrow('menu-open');
        this.#collapseAction = ViewHelper.getButtonOrThrow('menu-close');
        this.#sortActionMainText = ViewHelper.getSpanOrThrow('nav-footer-sort-main-text');
        this.#sortActionSubText = ViewHelper.getSpanOrThrow('nav-footer-sort-sub-text');
        this.#sortActionImage = ViewHelper.getSpanOrThrow('nav-footer-sort-svg');
        this.#showPageAboutAction = ViewHelper.getAnchorOrThrow('nav-menu-about');
        this.#showPageSignalsAction = ViewHelper.getAnchorOrThrow('nav-menu-signals');
        this.#showPageScreenerAction = ViewHelper.getAnchorOrThrow('nav-menu-screener');
       
        this.#expandAction.onclick = () => this.showSideMenu();
        this.#collapseAction.onclick = () => this.closeSideMenu();

        this.#showPageAboutAction.onclick = () => console.log(`Show about page clicked`);
        this.#showPageScreenerAction.onclick = () => console.log(`Show screener page clicked`);
        this.#showPageSignalsAction.onclick = () => console.log(`Show signals page clicked`);
        
    }

    showSideMenu() {
        this.#sidebar.classList.add('open');
    }

    closeSideMenu() {
        this.#sidebar.classList.remove('open');
    }

   

    getShowPageActions(): HTMLAnchorElement[] {
        return [this.#showPageAboutAction, this.#showPageScreenerAction, this.#showPageSignalsAction];
    }

    bindShowSectionAction(callback: (pageId: string) => ISection): void {
        let navs = this.getShowPageActions();
        for (var i = 0; i < navs.length; i++) {
            let current = navs[i];
            current.onclick = () => {
                navs.forEach(a=>a.classList.remove('active'));
                current.classList.add('active');
                this.#headerSectionName.textContent = current.textContent;
                let target = current.getAttribute('data-target-id');
                if(!target){
                    throw new Error(`No target found`);
                }
                var section = callback(target);
                ViewHelper.toggleVisibility(this.#footer, section.hasExternalActions());
                this.closeSideMenu();
            }
        }
    }

    

    public update(model: MainModel) {
        this.#sortActionMainText.textContent = model.getSortNamedAttributeMetadata().label;
        this.#sortActionSubText.textContent = model.getSortDirection() === SortDirection.Ascending ? 'Sorting ascending' : 'Sorting descending';
        if (model.getSortDirection() !== SortDirection.Descending) {
            this.#sortActionImage.classList.add('reverse');
        } else {
            this.#sortActionImage.classList.remove('reverse');
        }
    }

    public show(): void {
        this.#sidebar.classList.remove('d-hidden');
        this.#header.classList.remove('d-hidden');
        this.#footer.classList.remove('d-hidden');
    }

    public hide(): void {
        this.#sidebar.classList.add('d-hidden');
        this.#header.classList.add('d-hidden');
        this.#footer.classList.add('d-hidden');
    }
}