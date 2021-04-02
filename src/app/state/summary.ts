import {createReducer} from '@reduxjs/toolkit';
import {BalanceByLocation} from 'components/transactions/types';
import {useSelector} from 'react-redux';
import {Action, GlobalState} from 'app/state/defs';

export enum SummaryKey {
    BALANCE_BY_ACCOUNT,
}

export type Summary = Partial<{
    [SummaryKey.BALANCE_BY_ACCOUNT]: BalanceByLocation;
}>;

export const summaryReducer = createReducer(
    {},
    {
        [Action.SUMMARY_ASSIGNED]: (state, {payload}) => {
            return {...state, [payload.key]: payload.value};
        },
    },
);

export const useSummary = <K extends SummaryKey>(key: K): Summary[K] => {
    return useSelector((s: GlobalState) => s.summary[key]);
};

export const summaryAssign = <K extends SummaryKey>(key: K, value: Summary[K]) => {
    return {type: Action.SUMMARY_ASSIGNED, payload: {key, value}};
};
