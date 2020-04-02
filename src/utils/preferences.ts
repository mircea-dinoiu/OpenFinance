import {IncludeOption, ShiftDateOption} from 'defs';
import {Preferences} from 'types';
import {getInitialEndDate} from 'utils/dates';

export const parsePreferences = (
    state: Partial<Preferences> = {},
): Preferences => {
    const endDateIncrement = Number(state.endDateIncrement) || ShiftDateOption.oneWeek;
    const include = Number(state.include) || IncludeOption.all;
    const endDate = state.endDate || getInitialEndDate();
    // @ts-ignore
    const includePending = state.includePending === 'true';

    return {includePending, endDateIncrement, include, endDate};
};

export const validatePreferences = (state: Partial<Preferences> = {}) => {
    if (state.endDateIncrement && state.include && state.endDate) {
        return state;
    }

    return parsePreferences(state);
};
