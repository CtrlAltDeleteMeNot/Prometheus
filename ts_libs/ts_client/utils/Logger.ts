export class Logger {
    public static create(type: Function): TaggedLogger {
        return new TaggedLogger(type.name);
    }
}

export class TaggedLogger {
    constructor(private readonly tag: string) {}

    info(message: string, ...args: unknown[]) {
        console.info(`[${this.tag}] ${message}`, ...args);
    }

    warn(message: string, ...args: unknown[]) {
        console.warn(`[${this.tag}] ${message}`, ...args);
    }

    error(message: string, ...args: unknown[]) {
        console.error(`[${this.tag}] ${message}`, ...args);
    }
}