// @flow
import {parsePreferences} from 'common/utils/preferences';
import {TypeGlobalState} from 'common/types';

export const readState = () => {
    try {
        return {
            preferences: parsePreferences(
                Object.fromEntries(
                    new URLSearchParams(window.location.search).entries(),
                ),
            ),
        };
    } catch (e) {
        return undefined;
    }
};

export const saveState = (state: TypeGlobalState) => {
    try {
        window.history.replaceState(
            {},
            '',
            // @ts-ignore
            `/?${new URLSearchParams(state.preferences).toString()}`,
        );
    } catch (e) {
        // noop
    }
};
