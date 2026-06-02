export type LayoutShiftSource = {
    node: HTMLElement | null;
    previousRect: DOMRectReadOnly;
    currentRect: DOMRectReadOnly;
};

export type LayoutShiftEvent = {
    value: number;
    total: number;
    state: string;
    sources: LayoutShiftSource[];
};

type ElementStats = {
    element: HTMLElement;
    count: number;
    totalShift: number;
};

export class CLSMonitor {

    private observer: PerformanceObserver | null = null;

    private clsValue = 0;
    private state = 'unknown';

    private callback?: (event: LayoutShiftEvent) => void;

    // 🔥 profiling data
    private elementMap = new Map<HTMLElement, ElementStats>();
    private shiftLog: LayoutShiftEvent[] = [];

    constructor(callback?: (event: LayoutShiftEvent) => void) {
        this.callback = callback;
    }

    static Create(callback?: (event: LayoutShiftEvent) => void) {
        const instance = new CLSMonitor(callback);
        instance.start();
        return instance;
    }

    // =====================================================
    // CORE MONITOR
    // =====================================================

    public start() {
        if (!('PerformanceObserver' in window)) return;

        this.observer = new PerformanceObserver((list) => {

            for (const entry of list.getEntries() as any[]) {

                if (entry.hadRecentInput) continue;

                const sources: LayoutShiftSource[] =
                    (entry.sources || [])
                        .map((s: any) => ({
                            node: s.node as HTMLElement,
                            previousRect: s.previousRect,
                            currentRect: s.currentRect
                        }));

                this.clsValue += entry.value;

                const event: LayoutShiftEvent = {
                    value: entry.value,
                    total: this.clsValue,
                    state: this.state,
                    sources
                };

                this.processEvent(event);
            }
        });

        this.observer.observe({ type: 'layout-shift', buffered: true });
    }

    // =====================================================
    // PROFILING CORE
    // =====================================================

    private processEvent(event: LayoutShiftEvent) {

        this.shiftLog.push(event);

        for (const src of event.sources) {

            if (!src.node) continue;

            const el = src.node;

            const existing = this.elementMap.get(el);

            const delta =
                Math.abs(src.currentRect.top - src.previousRect.top) +
                Math.abs(src.currentRect.left - src.previousRect.left);

            if (existing) {
                existing.count += 1;
                existing.totalShift += delta;
            } else {
                this.elementMap.set(el, {
                    element: el,
                    count: 1,
                    totalShift: delta
                });
            }

            // optional visual debug
            this.highlight(el);
        }

        this.callback?.(event);
    }

    // =====================================================
    // DEBUG / VISUALIZATION
    // =====================================================

    private highlight(el: HTMLElement) {
        el.style.outline = '2px solid rgba(255,0,0,0.6)';
        el.style.transition = 'outline 0.2s';

        setTimeout(() => {
            el.style.outline = '';
        }, 500);
    }

    // =====================================================
    // PUBLIC API
    // =====================================================

    public setState(state: string) {
        this.state = state;
    }

    public getCLS() {
        return this.clsValue;
    }

    public reset() {
        this.clsValue = 0;
        this.elementMap.clear();
        this.shiftLog = [];
    }

    public stop() {
        this.observer?.disconnect();
        this.observer = null;
    }

    // =====================================================
    // PROFILING OUTPUTS
    // =====================================================

    public getWorstOffenders(limit = 10) {
        return Array.from(this.elementMap.values())
            .sort((a, b) => b.totalShift - a.totalShift)
            .slice(0, limit);
    }

    public getShiftLog() {
        return this.shiftLog;
    }
}