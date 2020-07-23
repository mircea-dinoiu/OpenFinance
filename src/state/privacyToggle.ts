import {createReducer} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';
import {Action} from 'state/defs';
import {GlobalState} from 'types';

const key = 'privacyToggle';

export const privacyToggle = createReducer<boolean>(
    !!JSON.parse(localStorage.getItem(key) as string),
    {
        [Action.SET_DISCRETE]: (state, {payload}: {payload: boolean}) =>
            payload,
    },
);

export const usePrivacyToggle = (): [boolean, (payload: boolean) => void] => {
    const dispatch = useDispatch();

    return [
        useSelector((s: GlobalState) => s.privacyToggle),
        (payload: boolean) => {
            localStorage.setItem(key, JSON.stringify(payload));
            dispatch({type: Action.SET_DISCRETE, payload});
        },
    ];
};
