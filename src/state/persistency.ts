import {parsePreferences} from 'utils/preferences';
import {GlobalState} from 'types';
import {paths} from 'js/defs';

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

export const saveState = (state: GlobalState) => {
    if (window.location.pathname !== paths.home) {
        return;
    }
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
