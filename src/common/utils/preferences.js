// @flow
import {getInitialEndDate} from 'common/utils/dates';
import type {TypePreferences} from 'common/types';

export const parsePreferences = (
    state: $Shape<TypePreferences> = {},
): TypePreferences => {
    const endDateIncrement = state.endDateIncrement || '2w';
    const include = state.include || 'all';
    const endDate = state.endDate || getInitialEndDate();
    const includePending = state.includePending === 'true';

    return {includePending, endDateIncrement, include, endDate};
};

export const validatePreferences = (state: $Shape<TypePreferences> = {}) => {
    if (state.endDateIncrement && state.include && state.endDate) {
        return state;
    }

    return parsePreferences(state);
};
