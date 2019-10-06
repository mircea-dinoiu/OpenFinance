// @flow weak
import {parsePreferences} from 'common/utils/preferences';
import {mapUrlSearchParamsToObject} from 'common/utils';

export const readState = () => {
    try {
        return {
            preferences: parsePreferences(
                mapUrlSearchParamsToObject(
                    new URLSearchParams(location.search),
                ),
            ),
        };
    } catch (e) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        history.replaceState(
            {},
            '',
            `/?${new URLSearchParams(state.preferences).toString()}`,
        );
    } catch (e) {
        // noop
    }
};
