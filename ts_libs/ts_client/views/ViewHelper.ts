export class ViewHelper {
    static setModalState(open:boolean): void{
        if(true === open){
            document.body.classList.add('modal-opened');
        }else{
            document.body.classList.remove('modal-opened');
        }
    }

    static getHtmlElementOrThrow(id: string): HTMLElement {
        const element = document.getElementById(id);
        if (!element) throw new Error(`Element with id ${id} not found.`);
        return element;
    }

    static getHtmlInputElementOrThrow(id: string): HTMLInputElement {
        const element = document.getElementById(id) as HTMLInputElement;
        if (!element) throw new Error(`Html input with id ${id} not found.`);
        return element;
    }

    static getButtonOrThrow(id: string): HTMLButtonElement {
        const element = document.getElementById(id) as HTMLButtonElement;
        if (!element) throw new Error(`Button with id ${id} not found.`);
        return element;
    }

    static getAnchorOrThrow(id: string): HTMLAnchorElement {
        const element = document.getElementById(id) as HTMLAnchorElement;
        if (!element) throw new Error(`Anchor with id ${id} not found.`);
        return element;
    }


    static getSpanOrThrow(id: string): HTMLSpanElement {
        const element = document.getElementById(id) as HTMLSpanElement;
        if (!element) throw new Error(`Button with id ${id} not found.`);
        return element;
    }

    static toggleVisibility(element: HTMLElement, visible: boolean): void {
        if (!visible && !element.classList.contains('d-none')) {
            element.classList.add('d-none');
            return;
        }
        if(visible && element.classList.contains('d-none')){
            element.classList.remove('d-none');
            return;
        }
    }

    static toggleVisibilityHidden(element: HTMLElement, visible: boolean): void {
        if (!visible && !element.classList.contains('d-hidden')) {
            element.classList.add('d-hidden');
            return;
        }
        if(visible && element.classList.contains('d-hidden')){
            element.classList.remove('d-hidden');
            return;
        }
    }

    static isVisible(element: HTMLElement){
       return !element.classList.contains('d-none');
    }
}