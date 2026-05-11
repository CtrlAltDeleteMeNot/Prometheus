export class EnumerateExchangesRequest {
    public includes: string[] | undefined;
    public constructor(includes?: string[]) {
        this.includes = includes;
        Object.freeze(this);
    }
}