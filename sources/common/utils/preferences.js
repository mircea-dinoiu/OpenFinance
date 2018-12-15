// @flow
import { getInitialEndDate } from 'common/utils/dates';

export const parsePreferences = (
    state = {},
): {
    endDateIncrement: string,
    include: string,
    endDate: string,
    includePending: ?boolean,
} => {
    const endDateIncrement = state.endDateIncrement || '2w';
    const include = state.include || 'until-now';
    const endDate = state.endDate || getInitialEndDate();
    const includePending = Boolean(state.includePending);

    return { includePending, endDateIncrement, include, endDate };
};

export const validatePreferences = (state = {}) => {
    if (state.endDateIncrement && state.include && state.endDate) {
        return state;
    }

    return parsePreferences(state);
};
