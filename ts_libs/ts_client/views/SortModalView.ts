import { MainModel } from "../models/MainModel";
import { ViewHelper } from "./ViewHelper";
import { SortDirection } from "../../ts_worker/application/exports/SortDirection";

export class SortModalView {
    #root: HTMLElement;
    #dismiss: HTMLButtonElement;
    #ascending: HTMLButtonElement;
    #descending: HTMLButtonElement;
    #apply: HTMLButtonElement;
    #fields: HTMLElement;
    #transientDirection: SortDirection | null = null;
    #transientSortKey: string | null = null;
    #onSortingRulesChanged: ((direction: SortDirection, sortKey: string) => void);
    constructor() {
        this.#root = ViewHelper.getHtmlElementOrThrow('sort-fields-modal');
        this.#dismiss = ViewHelper.getButtonOrThrow('sort-fields-modal-close');

        this.#apply = ViewHelper.getButtonOrThrow('sort-fields-modal-apply');
        this.#ascending = ViewHelper.getButtonOrThrow('sort-fields-modal-ascending');
        this.#descending = ViewHelper.getButtonOrThrow('sort-fields-modal-descending');

        this.#fields = ViewHelper.getHtmlElementOrThrow('sort-fields-modal-body');
        this.#ascending.onclick = () => {
            this.#descending.classList.remove('active');
            this.#ascending.classList.add('active');
        };
        this.#descending.onclick = () => {
            this.#ascending.classList.remove('active');
            this.#descending.classList.add('active');
        }
        this.#dismiss.onclick = () => this.hide();
        this.#apply.onclick = () => {
            if (this.isAnySortingRuleChanged()) {
                const direction = this.getSortDirectionFromView();
                const sortKey = this.getSortKeyFromView();
                this.#onSortingRulesChanged(direction, sortKey);
            }
            this.hide();
        };
        this.#onSortingRulesChanged = (direction, sortKey) => console.log(`Sorting rules changed: ${direction}, ${sortKey}.`);

    }

    public bindSortingRulesChanged(callback: (direction: SortDirection, sortKey: string) => void): void {
        this.#onSortingRulesChanged = callback;
    }


    private isAnySortingRuleChanged(): boolean {
        return !(this.#transientDirection === this.getSortDirectionFromView() && this.#transientSortKey === this.getSortKeyFromView());
    }



    public update(model: MainModel): void {
        this.updateSortDirection(model);
        this.generateSortSelectionElements(model);
    }

    private updateSortDirection(model: MainModel) {
        this.#transientDirection = model.getSortDirection();
        this.#ascending.classList.remove('active');
        this.#descending.classList.remove('active');

        if (model.getSortDirection() === SortDirection.Ascending) {
            this.#ascending.classList.add('active');
        }
        if (model.getSortDirection() === SortDirection.Descending) {
            this.#descending.classList.add('active');
        }

    }

    private generateSortSelectionElements(model: MainModel): void {
        this.#fields.innerHTML = '';
        const attributes = model.getSortableAttributes();
        if (!attributes || attributes.length == 0) {
            return;
        }
        this.#transientSortKey = model.getSortNamedAttributeMetadata().key;
        var buttons = attributes.flatMap(attr => {
            var button = document.createElement('button');
            button.classList.add('filter-button');
            if (attr.key === this.#transientSortKey) {
                button.classList.add('active');
            }
            button.setAttribute('data-key', attr.key);
            button.textContent = attr.label;
            this.#fields.append(button);
            return button;
        });
        buttons.forEach(button => {
            button.onclick = () => {
                buttons.forEach(toRemoveActive => toRemoveActive.classList.remove('active'));
                button.classList.add('active');
            }
        });
    }

    public show(): void {
        ViewHelper.toggleVisibility(this.#root, true);
    }

    public hide(): void {
        ViewHelper.toggleVisibility(this.#root, false);
    }

    private getSortDirectionFromView(): SortDirection {
        return this.#ascending.classList.contains('active') ?
            SortDirection.Ascending : SortDirection.Descending;
    }

    private getSortKeyFromView(): string {
        const selectedButton = this.#fields.querySelector('.pill-button.active') as HTMLButtonElement;
        const toReturn = selectedButton?.attributes?.getNamedItem('data-key')?.value;
        if (!toReturn) throw new Error('No active pill button found');
        return toReturn;
    }
}