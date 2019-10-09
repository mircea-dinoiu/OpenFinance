// @flow
import {parsePreferences} from 'common/utils/preferences';
import type {TypeGlobalState} from 'common/types';

export const readState = () => {
    try {
        return {
            preferences: parsePreferences(
                Object.fromEntries(
                    new URLSearchParams(location.search).entries(),
                ),
            ),
        };
    } catch (e) {
        return undefined;
    }
};

export const saveState = (state: TypeGlobalState) => {
    try {
        history.replaceState(
            {},
            '',
            // $FlowFixMe
            `/?${new URLSearchParams(state.preferences).toString()}`,
        );
    } catch (e) {
        // noop
    }
};
