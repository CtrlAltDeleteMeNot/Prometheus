export interface ISection {
    readonly title: string;
    readonly id:string;
    hasExternalActions():boolean;
    show(): void;
    hide(): void;
}