/**
 * Generic ring buffer with preallocated objects.
 */
export class RingBuffer<T> {
    private buffer: T[];
    private pointer: number = 0;
    private size: number = 0;

    constructor(
        private readonly capacity: number,
        factoryOrArray: (() => T) | T[]
    ) {
        if (capacity <= 0) {
            throw new RangeError(
                `Capacity must be greater than zero, got ${capacity}`
            );
        }
        this.buffer = new Array<T>(capacity);

        if (Array.isArray(factoryOrArray)) {
            if (factoryOrArray.length > capacity) {
                throw new RangeError(
                    `Initial array exceeds capacity (${factoryOrArray.length} > ${capacity})`
                );
            }

            for (let i = 0; i < factoryOrArray.length; i++) {
                this.buffer[i] = factoryOrArray[i];
            }

            this.size = factoryOrArray.length;
            this.pointer = factoryOrArray.length % capacity;
        } else if (typeof factoryOrArray === "function") {
            const factory = factoryOrArray;
            for (let i = 0; i < capacity; i++) {
                this.buffer[i] = factory();
            }
        } else {
            throw new TypeError(
                "Second argument must be a factory function or an array"
            );
        }
    }

    /**
     * Push values into the next preallocated object
     * @param setter - function that modifies the preallocated object
     */
    push(setter: (item: T) => void): void {
        const item = this.buffer[this.pointer];
        setter(item);

        this.pointer = (this.pointer + 1) % this.capacity;
        if (this.size < this.capacity) this.size++;
    }

    /**
     * Get an item counted backward from newest.
     * @param n - 0 = last inserted, 1 = previous item
     */
    get(n = 0): T {
        if (n < 0 || n >= this.size) {
            throw new RangeError(`Invalid index ${n}, buffer size is ${this.size}`);
        }
        const idx = (this.pointer - 1 - n + this.capacity) % this.capacity;
        return this.buffer[idx];
    }

    /** Returns full internal buffer */
    raw(): T[] {
        return this.buffer;
    }

    /** Capacity of the buffer */
    getCapacity(): number {
        return this.capacity;
    }

    /** Next insertion pointer */
    getPointer(): number {
        return this.pointer;
    }

    /** Number of elements currently stored */
    getSize(): number {
        return this.size;
    }
}
