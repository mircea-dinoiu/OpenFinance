// @flow

export const getScrollPct = (element) =>
    Math.round(
        (element.scrollTop / (element.scrollHeight - element.clientHeight)) *
            100,
    );

export const scrollIsAt = (element: Element, at: number) =>
    getScrollPct(element) >= at;

export const scrollReachedBottom = (element: Element) =>
    scrollIsAt(element, 100);
