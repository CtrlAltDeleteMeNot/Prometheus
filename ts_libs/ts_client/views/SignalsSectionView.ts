import { SignalDirection, SignalModel } from "../../ts_worker/application/exports/SignalModel";
import { Logger, TaggedLogger } from "../utils/Logger";
import { WakeLock } from "../utils/WakeLock";
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
    #manualSyncButton: HTMLButtonElement;
    #autoSyncButton: HTMLButtonElement;
    #autoSyncEnabled: boolean;
    #autoSyncTimer: number | undefined;
    #latestSignalTs: number | undefined;
    #notificationAudio: HTMLAudioElement;
    #autoSyncButtonText: HTMLSpanElement;
    #autoSyncButtonSubText: HTMLSpanElement;
    #wakeLock: WakeLock;
    #syncRequested: (()=>Promise<void>)|undefined;
    #logger: TaggedLogger;

    constructor() {
        this.id = 'signals';
        this.title = 'Signals';
        this.#logger = Logger.create(SignalSectionView);
        this.#root = ViewHelper.getHtmlElementOrThrow('signals');
        this.#footer = ViewHelper.getHtmlElementOrThrow('footer-signals');
        this.#signalsGrid = ViewHelper.getHtmlElementOrThrow('signals-grid');
        this.#loadMoreBtn = ViewHelper.getButtonOrThrow('signals-load-more');
        this.#autoSyncButtonText = ViewHelper.getSpanOrThrow('footer-signals-button-sync-automatically-main-text');
        this.#autoSyncButtonSubText = ViewHelper.getSpanOrThrow('footer-signals-button-sync-automatically-sub-text');
        this.#autoSyncButtonText.textContent = "Live Monitoring";
        this.#autoSyncButtonSubText.textContent = "Disabled";
        this.#loadMoreBtn.onclick = () => this.loadNextPage();
        this.#signals = [];
        this.#manualSyncButton = ViewHelper.getButtonOrThrow('footer-signals-button-sync-manually');
        this.#manualSyncButton.onclick = () => this.requestSynchronization();
        this.#autoSyncEnabled = false;
        this.#autoSyncButton = ViewHelper.getButtonOrThrow('footer-signals-button-sync-automatically');
        this.#autoSyncButton.onclick = () => this.toggleAutoSync();
        this.#autoSyncTimer = undefined;
        this.#notificationAudio = new Audio('https://dn711000.ca.archive.org/0/items/android-4.1.2-stock-ringtones/ringtones/Seville.mp3');
        this.#wakeLock = new WakeLock();
    }

    private onTimerCallback() {
        this.#logger.info(`Timer fired, autosync status: ${this.#autoSyncEnabled}`);
        if (this.#autoSyncEnabled === false) {
            return;
        }
        this.requestSynchronization();
    }

    private async requestSynchronization(): Promise<void> {
        if (!this.#syncRequested) {
            return;
        }
        await this.#syncRequested();
    }

    private toggleAutoSync() {
        //console.log(`Autosync action clicked`);
        this.#autoSyncEnabled = !this.#autoSyncEnabled;
        this.onAutosyncChanged();
    }

    private onAutosyncChanged(): void {
        if (this.#autoSyncEnabled) {
            this.#autoSyncButtonSubText.textContent = "Enabled";
            this.#autoSyncButton.classList.add('btn--primary');
            this.#manualSyncButton.classList.add('d-hidden');
            this.onTimerCallback();
            this.#autoSyncTimer = window.setInterval(
                () => { this.onTimerCallback(); },
                60_000
            );
            this.#wakeLock.acquire();
        } else {
            this.#autoSyncButtonSubText.textContent = "Disabled";
            this.#autoSyncButton.classList.remove('btn--primary');
            this.#manualSyncButton.classList.remove('d-hidden');
            if (this.#autoSyncTimer !== undefined) {
                window.clearInterval(this.#autoSyncTimer);
                this.#autoSyncTimer = undefined;
            }
            this.#wakeLock.release();
        }
    }



    /**
    * Bind a callback to the sync button
    */
    bindSynchronizationRequested(callback: () =>  Promise<void>): void {
        this.#syncRequested = callback;
    }

    loadNextPage(): void {
        this.#currentPage++;
        this.renderCards();
    }

    hasExternalActions(): boolean {
        return true;
    }

    setData(signals: readonly SignalModel[]) {
        this.checkNewDataArrived(signals);
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

        const headerTextContents = document.createElement("div");
        headerTextContents.classList.add("signal-card__header__texts");

        const title = document.createElement("h3");
        title.classList.add("signal-card__title");
        title.textContent = `${signalModel.baseAsset}/${signalModel.quoteAsset}`;

        const subtitle = document.createElement("p");
        subtitle.classList.add("signal-card__subtitle");
        subtitle.textContent = signalModel.exchangeName;

        headerTextContents.appendChild(title);
        headerTextContents.appendChild(subtitle);


        const button = document.createElement('button');
        button.className = 'btn btn--square btn--icon';
        button.type = 'button';

        button.addEventListener('click', () => {
            this.disableAutosync();
            window.open(signalModel.exchangeUrl, '_blank', 'noopener,noreferrer');
        });


        const btnSvg = getActionIconSVGElement('arrow-right');
        btnSvg.classList.add('icon');
        btnSvg.setAttribute('role', 'img');

        button.appendChild(btnSvg);


        header.appendChild(headerTextContents);
        header.appendChild(button);



        const description = document.createElement("div");
        description.classList.add("signal-card__description");
        description.textContent = signalModel.description;

        const footer = document.createElement("div");
        footer.classList.add("signal-card__footer");

        const time = document.createElement("span");
        time.classList.add("signal-card__time");
        time.textContent = this.formatTime(signalModel.timestamp);

        footer.appendChild(time);

        inner.appendChild(header);
        inner.appendChild(description);
        inner.appendChild(footer);

        return inner;
    }

    private formatTime(timestamp: number): string {
        return new Date(timestamp).toLocaleString([], {
            timeZone: "UTC",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }) + " UTC";
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
        this.disableAutosync();
    }

    public hide() {
        ViewHelper.toggleVisibility(this.#root, false);
        ViewHelper.toggleVisibility(this.#footer, false);
        this.disableAutosync();
    }

    private disableAutosync(){
        this.#autoSyncEnabled = false;
        this.onAutosyncChanged();
    }

    private checkNewDataArrived(signals: readonly SignalModel[]) {
        if (signals.length === 0) {
            return;
        }
        const latest = signals[signals.length - 1];
        if (this.#latestSignalTs !== latest.timestamp) {
            this.#latestSignalTs = latest.timestamp;
            if (this.#autoSyncEnabled) {
                this.playNotificationSound();
            }
        }
    }
    private playNotificationSound() {
        this.#notificationAudio.currentTime = 0;
        void this.#notificationAudio
            .play()
            .catch((error) => this.#logger.warn(error));
    }
}