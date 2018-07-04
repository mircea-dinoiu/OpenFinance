// @flow
import pick from 'lodash/pick';

const key = 'FINANCIAL_STATE';
const persistentReducers = [
    'preferences',
];

export const readState = () => {
    try {
        const serialized = localStorage.getItem(key);

        if (serialized === null) {
            return undefined;
        }

        return JSON.parse(serialized);
    } catch (e) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serialized = JSON.stringify(pick(state, ...persistentReducers));

        localStorage.setItem(key, serialized);
    } catch (e) {
        // noop
    }
};