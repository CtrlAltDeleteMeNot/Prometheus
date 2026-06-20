import { TradingPairModel } from '../../ts_worker/application/exports/TradingPairModel';
import { ViewHelper } from './ViewHelper';
import { getActionIconSVGElement } from './generated/ActionIconsRegistry'
import { ISection } from './ISection'
import { getSymbolImageUrlById } from './generated/SymbolIconsRegistry';


export class ScreenerSectionView implements ISection {
    #root: HTMLElement;
    #screenerGrid: HTMLElement;
    #allData: readonly TradingPairModel[] = [];
    #currentPage = 1;
    #pageSize = 30;
    title: string;
    id: string;

    #loadMoreBtn: HTMLButtonElement;
    #cards: HTMLDivElement[] = [];
    #footer: HTMLElement;

    //actions
    #syncAction: HTMLButtonElement;
    #sortAction: HTMLButtonElement;
    #filterAction: HTMLButtonElement;

    constructor() {
        this.title = "Screener";
        this.id = "screener";
        // Initialize the root
        this.#root = ViewHelper.getHtmlElementOrThrow(this.id);
        this.#screenerGrid = ViewHelper.getHtmlElementOrThrow('screener-grid');
        this.#loadMoreBtn = ViewHelper.getButtonOrThrow('screener-load-more');
        this.#footer = ViewHelper.getHtmlElementOrThrow('footer-screener');
        this.#loadMoreBtn.onclick = () => this.loadNextPage();
        this.#syncAction = ViewHelper.getButtonOrThrow('nav-footer-sync');
        this.#sortAction = ViewHelper.getButtonOrThrow('nav-footer-sort');
        this.#filterAction = ViewHelper.getButtonOrThrow('nav-footer-filter');

        this.#sortAction.onclick = () => console.log(`Sort action clicked`);
        this.#syncAction.onclick = () => console.log(`Sync action clicked`);
        this.#filterAction.onclick = () => console.log(`Filter action clicked`);
    }

    hasExternalActions(): boolean {
        return true;
    }


    private loadNextPage() {
        const totalPages = Math.ceil(this.#allData.length / this.#pageSize);
        if (this.#currentPage < totalPages) {
            this.#currentPage++;
            this.renderCards();
        }
    }

    private renderCards() {
        // Clear existing cards
        this.#cards.forEach(el => el.remove());
        this.#cards = [];

        const start = 0;
        const end = this.#currentPage * this.#pageSize;
        const pageData = this.#allData.slice(start, end);

        pageData.forEach((tp, index) => {
            const card = document.createElement('div');
            card.className = 'screener-card';
            card.appendChild(this.generateCardInner(tp));
            this.#cards.push(card);
            this.#screenerGrid.appendChild(card);
        });

        // Hide Load More if all cards are loaded
        if (end >= this.#allData.length) {
            ViewHelper.toggleVisibility(this.#loadMoreBtn, false);
        } else {
            ViewHelper.toggleVisibility(this.#loadMoreBtn, true);
        }
    }


    private generateCardInner(tp: TradingPairModel): HTMLDivElement {
        const wrapper = document.createElement('div');

        // ===== Asset pair description =====
        const description = document.createElement('div');
        description.className = 'asset-pair-description';

        const imagesHolder = document.createElement('div');
        imagesHolder.className = 'asset-and-exchange-images-holder';


        const assetIconUrl = getSymbolImageUrlById(tp.exchangeName + "_" + tp.baseAsset); // URL
        const assetImg = document.createElement('img');
        assetImg.className = 'asset-image';
        assetImg.src = assetIconUrl;
        assetImg.alt = tp.baseAsset;
        assetImg.loading = 'lazy';

        const exchangeImg = document.createElement('img');
        exchangeImg.className = 'exchange-image';
        exchangeImg.src = `img/exchanges/${tp.exchangeName}.svg`;
        exchangeImg.alt = tp.exchangeName;

        imagesHolder.appendChild(assetImg);
        imagesHolder.appendChild(exchangeImg);

        const textContainer = document.createElement('div');

        const title = document.createElement('h3');
        title.className = 'asset-pair-title';
        title.textContent = `${tp.baseAsset}/${tp.quoteAsset}`;

        const subtitle = document.createElement('p');
        subtitle.className = 'asset-pair-subtitle';
        subtitle.textContent = tp.exchangeName;

        textContainer.appendChild(title);
        textContainer.appendChild(subtitle);

        const button = document.createElement('button');
        button.className = 'btn btn--square btn--icon';
        button.type = 'button';

        button.addEventListener('click', () => {
            window.open(tp.exchangeUrl, '_blank', 'noopener,noreferrer');
        });

        //const arrowRightSvg = this.#domParser.parseFromString(getActionIconId('arrow-right'),"image/svg+xml");
        const btnSvg = getActionIconSVGElement('arrow-right');
        btnSvg.classList.add('icon');
        btnSvg.setAttribute('role', 'img');

        button.appendChild(btnSvg);

        description.appendChild(imagesHolder);
        description.appendChild(textContainer);
        description.appendChild(button);

        // ===== Attributes =====
        const attributesContainer = document.createElement('div');
        attributesContainer.className = 'asset-attributes';

        tp.getNumericAttributes().forEach((attr) => {
            const row = document.createElement('div');
            row.className = 'screener-card-row';

            const label = document.createElement('span');
            label.textContent = attr.metadata?.label ?? '';

            const value = document.createElement('span');
            const key = attr.metadata?.key;
            value.textContent = key ? tp.getAttr(key)?.toString() ?? '-' : '-';

            row.appendChild(label);
            row.appendChild(value);

            attributesContainer.appendChild(row);
        });

        // ===== Assemble =====
        wrapper.appendChild(description);
        wrapper.appendChild(attributesContainer);

        return wrapper;
    }

    public setData(data: readonly TradingPairModel[]) {
        this.#allData = data;
        this.#currentPage = 1;
        this.renderCards();
        requestAnimationFrame(() => {
            this.#screenerGrid.scrollTo(0, 0);
        });
    }

    public show() {
        ViewHelper.toggleVisibility(this.#root, true);
        ViewHelper.toggleVisibility(this.#footer, true);
    }

    public hide() {
        ViewHelper.toggleVisibility(this.#root, false);
        ViewHelper.toggleVisibility(this.#footer, false);
    }

     /**
    * Bind a callback to the sort button
    */
    bindSortButton(callback: () => void | Promise<void>): void {
        this.#sortAction.onclick = callback;
    }

    /**
    * Bind a callback to the sync button
    */
    bindSyncButton(callback: () => void | Promise<void>): void {
        this.#syncAction.onclick = callback;
    }

    /**
    * Bind a callback to the filter button
    */
    bindFilterButton(callback: () => void | Promise<void>): void {
        this.#filterAction.onclick = callback;
    }
}
