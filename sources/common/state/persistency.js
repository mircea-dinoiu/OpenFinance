// @flow
import {parsePreferences} from 'common/utils/preferences';
import {mapUrlSearchParamsToObject} from 'common/utils';
import type {TypeGlobalState} from 'common/types';

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
