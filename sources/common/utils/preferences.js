// @flow
import { getInitialEndDate } from 'common/utils/dates';

export const FINANCIAL_PREFERENCES = 'FINANCIAL_PREFERENCES';

export const readPreferences = () =>
    JSON.parse(localStorage.getItem(FINANCIAL_PREFERENCES) || '{}');

export const savePreferences = (value) => {
    localStorage.setItem(FINANCIAL_PREFERENCES, JSON.stringify(value));
};

export const parsePreferences = (
    state,
): {
    endDateIncrement: string,
    include: string,
    endDate: string,
} => {
    const endDateIncrement = state.endDateIncrement || '2w';
    const include = state.include || 'ut';
    const endDate = state.endDate || getInitialEndDate();

    return { endDateIncrement, include, endDate };
};
