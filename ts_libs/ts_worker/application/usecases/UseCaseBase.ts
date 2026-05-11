/**
 * Base class for application use cases.
 * @template Request - input type
 * @template Response - output type
 */
export abstract class UseCaseBase<Request, Response> {
    /**
     * Execute the use case with the given request model.
     * Handles validation, execution, and error handling.
     * @param requestModel - the input for the use case
     * @returns a promise resolving to the response
     */
    async execute(requestModel: Request): Promise<Response> {
        try {
            this.validate(requestModel);
            const result = await this.run(requestModel);
            return result;
        } catch (err) {
            this.handleError(err);
            throw err;
        }
    }

    /**
     * Validate the request model.
     * Subclasses can override to implement validation logic.
     * @param requestModel - the input to validate
     */
    protected validate(requestModel: Request): void {
        // no-op by default
    }

    /**
     * Core logic of the use case.
     * Must be implemented by subclasses.
     * @param requestModel - the input for the use case
     */
    protected abstract run(requestModel: Request): Promise<Response>;

    /**
     * Handle errors during execution.
     * Subclasses can override for custom logging or recovery.
     * @param err - the error thrown during execute
     */
    protected handleError(err: unknown): void {
        console.error(err);
    }
}
