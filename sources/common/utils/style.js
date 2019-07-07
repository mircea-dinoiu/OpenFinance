// @flow

import {objectEntriesOfSameType} from 'common/utils/collection';

export const modifiersToClassName = (css: {}, modifiers: {}) =>
    objectEntriesOfSameType(modifiers)
        .filter((each) => Boolean(each[1]))
        .map((each) => css[each[0]])
        .join(' ');
