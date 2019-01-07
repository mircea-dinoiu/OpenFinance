// @flow
import { stringify, parse } from 'query-string';

export const readState = () => {
    try {
        return {
            preferences: parse(location.search)
        };
    } catch (e) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        history.replaceState({}, '', `/?${stringify(state.preferences)}`);
    } catch (e) {
        // noop
    }
};
