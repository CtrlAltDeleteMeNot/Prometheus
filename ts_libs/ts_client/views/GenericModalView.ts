import { ViewHelper } from "./ViewHelper";

export type GenericModalResult = "primary" | "secondary" | "dismiss";

export class GenericModalView {
    #root: HTMLElement;
    #title: HTMLElement;
    #body: HTMLElement;
    #dismiss: HTMLButtonElement;
    #primary: HTMLButtonElement;
    #secondary: HTMLButtonElement;

    #resolver: ((result: GenericModalResult) => void) | null = null;

    constructor() {
        this.#root = ViewHelper.getHtmlElementOrThrow("generic-modal");
        this.#title = ViewHelper.getHtmlElementOrThrow("generic-modal-title");
        this.#body = ViewHelper.getHtmlElementOrThrow("generic-modal-body");
        this.#dismiss = ViewHelper.getButtonOrThrow("generic-modal-close");
        this.#primary = ViewHelper.getButtonOrThrow("generic-modal-primary");
        this.#secondary = ViewHelper.getButtonOrThrow("generic-modal-secondary");

        this.#dismiss.onclick = () => this.close("dismiss");
        this.#secondary.onclick = () => this.close("secondary");
        this.#primary.onclick = () => this.close("primary");
    }

    public show(
        title: string,
        body: string | HTMLElement,
        primaryText: string = "OK",
        secondaryText: string = "Cancel"
    ): Promise<GenericModalResult> {
        this.#title.textContent = title;
        this.#primary.textContent = primaryText;
        this.#secondary.textContent = secondaryText;

        this.#body.innerHTML = "";

        if (typeof body === "string") {
            this.#body.textContent = body;
        } else {
            this.#body.appendChild(body);
        }

        ViewHelper.setModalState(true);
        ViewHelper.toggleVisibility(this.#root, true);

        return new Promise(resolve => {
            this.#resolver = resolve;
        });
    }

    public async confirm(
        title: string,
        message: string,
        primaryText: string = "Confirm",
        secondaryText: string = "Cancel"
    ): Promise<boolean> {
        const result = await this.show(
            title,
            message,
            primaryText,
            secondaryText
        );

        return result === "primary";
    }

    public hide(): void {
        this.close("dismiss");
    }

    private close(result: GenericModalResult): void {
        ViewHelper.toggleVisibility(this.#root, false);
        ViewHelper.setModalState(false);

        if (this.#resolver) {
            this.#resolver(result);
            this.#resolver = null;
        }
    }
}