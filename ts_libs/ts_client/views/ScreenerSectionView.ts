import { TradingPairModel } from '../../ts_worker/application/exports/TradingPairModel';
import { ViewHelper } from './ViewHelper';
import { getActionIconSVGElement } from './generated/ActionIconsRegistry'
import { ISection } from './ISection'
import { getSymbolSvgUrlById } from './generated/SymbolIconsRegistry';


export class ScreenerSectionView implements ISection {
    #root: HTMLElement;
    #screenerBody: HTMLElement;
    #allData: readonly TradingPairModel[] = [];
    #currentPage = 1;
    #pageSize = 30;
    title: string;
    id: string;
    // Optional "Load More" button
    #loadMoreBtn: HTMLButtonElement;

    constructor() {
        this.title = "Screener";
        this.id = "screener";
        // Initialize the root
        this.#root = ViewHelper.getHtmlElementOrThrow(this.id);
        this.#screenerBody = ViewHelper.getHtmlElementOrThrow('screener-body');


        // Create Load More button at the bottom
        this.#loadMoreBtn = document.createElement('button');
        this.#loadMoreBtn.textContent = 'Load more';
        this.#loadMoreBtn.className = 'pill-button';
        this.#loadMoreBtn.style = 'flex: 1 1 100%;text-align: center;';
        this.#loadMoreBtn.onclick = () => this.loadNextPage();
        this.#screenerBody.appendChild(this.#loadMoreBtn);
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
        this.#screenerBody.querySelectorAll('.screener-card').forEach(el => el.remove());

        const start = 0;
        const end = this.#currentPage * this.#pageSize;
        const pageData = this.#allData.slice(start, end);

        pageData.forEach((tp, index) => {
            const card = document.createElement('div');
            card.className = 'screener-card';
            card.appendChild(this.generateCardInner(tp));
            this.#screenerBody.insertBefore(card, this.#loadMoreBtn); 
        });

        // Hide Load More if all cards are loaded
        if (end >= this.#allData.length) {
            this.#loadMoreBtn!.style.display = 'none';
        } else {
            this.#loadMoreBtn!.style.display = 'block';
        }
    }


    private generateCardInner(tp: TradingPairModel): HTMLDivElement {
        const wrapper = document.createElement('div');

        // ===== Asset pair description =====
        const description = document.createElement('div');
        description.className = 'asset-pair-description';

        const imagesHolder = document.createElement('div');
        imagesHolder.className = 'asset-and-exchange-images-holder';


        const assetIconUrl = getSymbolSvgUrlById(tp.baseAsset, 'generic'); // URL
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
        button.className = 'icon-only-pill';
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
            document.scrollingElement?.scrollTo(0, 0);
        });
    }

    public show() {
        ViewHelper.toggleVisibility(this.#root, true);
    }

    public hide() {
        ViewHelper.toggleVisibility(this.#root, false);
    }
}
