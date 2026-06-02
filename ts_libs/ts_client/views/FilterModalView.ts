import { NamedAttributeMetadata } from "../../ts_worker/application/exports/NamedAttribute";
import { MainModel } from "../models/MainModel";
import { ViewHelper } from "./ViewHelper";

type FilteringRulesChangedHandler = (rules: NamedAttributeMetadata[]) => void;
export class FilterModalView {

    #root: HTMLElement;
    #dismiss: HTMLButtonElement;
    #apply: HTMLButtonElement;
    #cancel: HTMLButtonElement;
    #fields: HTMLElement;
    #buttons: HTMLButtonElement[] | undefined;
    #attributes: NamedAttributeMetadata[] | undefined;
    #active: NamedAttributeMetadata[] | undefined;
    #filteringRulesChangedHandler: FilteringRulesChangedHandler;
    constructor() {
        this.#root = ViewHelper.getHtmlElementOrThrow('filter-fields-modal');
        this.#dismiss = ViewHelper.getButtonOrThrow('filter-fields-modal-close');
        this.#apply = ViewHelper.getButtonOrThrow('filter-fields-modal-apply');
        this.#cancel = ViewHelper.getButtonOrThrow('filter-fields-modal-cancel');
        this.#fields = ViewHelper.getHtmlElementOrThrow('filter-fields-modal-body');
        this.#filteringRulesChangedHandler = (rules)=> console.log(`Rules changed ${rules}`);
        this.#dismiss.onclick = () => {
            this.hide();
        };
        this.#cancel.onclick = () => {
            this.hide();
        }
        this.#apply.onclick = () => {
            const selection = this.getSelectedAttributes();
            const selectionChanged = this.checkSelectionChanged(selection);
            if (selectionChanged) {
                console.log(`Selection changed. ${JSON.stringify(selection)}`);
                this.#filteringRulesChangedHandler(selection);
            }
            this.hide();
        };
    }

    public bindFilteringRulesChanged(filteringRulesChangedHandler: FilteringRulesChangedHandler): void {
        this.#filteringRulesChangedHandler = filteringRulesChangedHandler;
    }

    checkSelectionChanged(selection: NamedAttributeMetadata[]): boolean {

        const activeKeys = (this.#active ?? [])
            .map(a => a.key)
            .sort();

        const selectedKeys = selection
            .map(a => a.key)
            .sort();

        if (activeKeys.length !== selectedKeys.length) {
            return true;
        }

        return activeKeys.some((key, index) => key !== selectedKeys[index]);
    }

    getSelectedAttributes(): NamedAttributeMetadata[] {
        const activeKeys = this.#buttons
            ?.filter(button => button.classList.contains('active'))
            ?.map(button => button.getAttribute('data-key'));

        if (!activeKeys || !this.#attributes) {
            return [];
        }

        return this.#attributes.filter(attr => activeKeys.includes(attr.key));
    }

    public update(model: MainModel) {
        this.#fields.innerHTML = ``;
        this.#buttons = [];
        this.#attributes = model.getFilterableAttributes()?.slice(0) ?? undefined;
        this.#active = model.getActiveFilterableAttributes();
        if (this.#attributes === undefined) {
            return;
        }

        this.#buttons = this.#attributes.flatMap(attr => {
            var button = document.createElement('button');
            button.classList.add('filter-button');
            const isActive = this.#active !== undefined && this.#active.some(s => s.key === attr.key);
            if (isActive) {
                button.classList.add('active');
            }
            button.setAttribute('data-key', attr.key);
            button.textContent = attr.label;
            this.#fields.append(button);
            return button;
        });
        this.#buttons.forEach(button => {
            button.onclick = () => {
                button.classList.toggle('active');
            }
        });
    }

    public show(): void {
        ViewHelper.toggleVisibility(this.#root, true);
    }

    public hide(): void {
        ViewHelper.toggleVisibility(this.#root, false);
    }
}