// @flow

export const modifiersToClassName = (css, modifiers) =>
    Object.entries(modifiers)
        .filter((each) => Boolean(each[1]))
        .map((each) => css[each[0]])
        .join(' ');
