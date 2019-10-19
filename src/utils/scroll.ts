
export const getScrollPct = (element: HTMLElement) =>
    Math.round(
        (element.scrollTop / (element.scrollHeight - element.clientHeight)) *
            100,
    );

export const scrollIsAt = (element: HTMLElement, at: number) =>
    getScrollPct(element) >= at;

export const scrollReachedBottom = (element: HTMLElement) =>
    scrollIsAt(element, 100);
