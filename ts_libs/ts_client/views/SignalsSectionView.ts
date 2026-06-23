import { SignalDirection, SignalModel } from "../../ts_worker/application/exports/SignalModel";
import { MainModel } from "../models/MainModel";
import { getActionIconSVGElement } from "./generated/ActionIconsRegistry";
import { ISection } from "./ISection";
import { ViewHelper } from "./ViewHelper";

export class SignalSectionView implements ISection {

    #root: HTMLElement;
    #footer: HTMLElement;
    title: string;
    id: string;
    #signalsGrid: HTMLElement;
    #loadMoreBtn: HTMLButtonElement;
    #cards: HTMLDivElement[] = [];
    #currentPage = 1;
    #pageSize = 30;
    #signals: readonly SignalModel[];

    constructor() {
        this.id = 'signals';
        this.title = 'Signals';
        this.#root = ViewHelper.getHtmlElementOrThrow('signals');
        this.#footer = ViewHelper.getHtmlElementOrThrow('footer-signals');
        this.#signalsGrid = ViewHelper.getHtmlElementOrThrow('signals-grid');
        this.#loadMoreBtn = ViewHelper.getButtonOrThrow('signals-load-more');
        this.#loadMoreBtn.onclick = () => this.loadNextPage();
        this.#signals = [];
    }

    loadNextPage(): void {
        this.#currentPage++;
        this.renderCards();
    }

    hasExternalActions(): boolean {
        return true;
    }

    setData(signals: readonly SignalModel[]) {
        this.#signals = signals;
        this.#currentPage = 1;
        this.renderCards();
    }

    private renderCards() {
        // Clear existing cards
        this.#cards.forEach(el => el.remove());
        this.#cards = [];

        const end = this.#currentPage * this.#pageSize;
        const pageData = this.#signals.slice(-end).reverse();

        pageData.forEach((signalModel, index) => {
            const card = document.createElement('div');
            card.className = 'signal-card';
            card.classList.add(this.getDirectionClass(signalModel.direction));
            card.appendChild(this.generateCardInner(signalModel));
            this.#cards.push(card);
            this.#signalsGrid.appendChild(card);
        });

        // Hide Load More if all cards are loaded
        ViewHelper.toggleVisibility(
            this.#loadMoreBtn,
            end < this.#signals.length
        );
    }

    private generateCardInner(signalModel: SignalModel): HTMLDivElement {
        const inner = document.createElement("div");
        inner.classList.add("signal-card__inner");

        const header = document.createElement("div");
        header.classList.add("signal-card__header");

        const title = document.createElement("h3");
        title.classList.add("signal-card__title");
        title.textContent = `${signalModel.baseAsset}/${signalModel.quoteAsset}`;

        const direction = document.createElement("span");
        direction.classList.add("signal-card__direction");
        direction.textContent = signalModel.direction;

        header.appendChild(title);
        header.appendChild(direction);

        const subtitle = document.createElement("div");
        subtitle.classList.add("signal-card__subtitle");
        subtitle.textContent = signalModel.exchangeName;

        const description = document.createElement("div");
        description.classList.add("signal-card__description");
        description.textContent = signalModel.description;

        const footer = document.createElement("div");
        footer.classList.add("signal-card__footer");

        const time = document.createElement("span");
        time.classList.add("signal-card__time");
        time.textContent = this.formatTime(signalModel.timestamp);

        const button = document.createElement('button');
        button.className = 'btn btn--square btn--icon';
        button.type = 'button';

        button.addEventListener('click', () => {
            window.open(signalModel.exchangeUrl, '_blank', 'noopener,noreferrer');
        });


        const btnSvg = getActionIconSVGElement('arrow-right');
        btnSvg.classList.add('icon');
        btnSvg.setAttribute('role', 'img');

        button.appendChild(btnSvg);

        footer.appendChild(time);
        footer.appendChild(button);

        inner.appendChild(header);
        inner.appendChild(subtitle);
        inner.appendChild(description);
        inner.appendChild(footer);

        return inner;
    }

    private formatTime(timestamp: number): string {
        return new Date(timestamp).toLocaleString([], {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

     private getDirectionClass(direction: SignalDirection): string {
            switch (direction) {
                case SignalDirection.BULLISH:
                    return "signal-card--bullish";
    
                case SignalDirection.BEARISH:
                    return "signal-card--bearish";
    
                case SignalDirection.NEUTRAL:
                    return "signal-card--neutral";
            }
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