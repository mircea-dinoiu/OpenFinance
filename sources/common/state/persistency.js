// @flow weak
import {parsePreferences} from 'common/utils/preferences';
import {stringify, parse} from 'query-string';

export const readState = () => {
    try {
        return {
            preferences: parsePreferences(parse(location.search)),
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
