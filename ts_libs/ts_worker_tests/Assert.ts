export class Assert {
    /**
     * Assert that a condition is true
     * @param condition 
     * @param message 
     */
    static assertTrue(condition: boolean, message?: string): void {
        if (!condition) {
            throw new Error(message ?? "Expected condition to be true");
        }
    }

    /**
     * Assert that a condition is false
     * @param condition 
     * @param message 
     */
    static assertFalse(condition: boolean, message?: string): void {
        if (condition) {
            throw new Error(message ?? "Expected condition to be false");
        }
    }

    /**
     * Assert that two values are strictly equal
     * @param expected 
     * @param actual 
     * @param message 
     */
    static assertEquals<T>(expected: T, actual: T, message?: string): void {
        if (expected !== actual) {
            throw new Error(message ?? `Expected ${expected}, but got ${actual}`);
        }
    }

    /**
     * Assert that a value is not null or undefined
     * @param value 
     * @param message 
     */
    static assertNotNull<T>(value: T | null | undefined, message?: string): asserts value is T {
        if (value === null || value === undefined) {
            throw new Error(message ?? `Expected value to be not null or undefined`);
        }
    }

    /**
     * Assert that a function throws an error
     * @param fn 
     * @param message 
     */
    static assertThrows(fn: () => any, message?: string): void {
        let threw = false;
        try {
            fn();
        } catch {
            threw = true;
        }
        if (!threw) {
            throw new Error(message ?? "Expected function to throw an error");
        }
    }
}
