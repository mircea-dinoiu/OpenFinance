import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';
import {GlobalState} from 'types';

export const useActions = <T>(actions: T): T => {
    const dispatch = useDispatch();

    // @ts-ignore
    return React.useMemo(() => bindActionCreators(actions, dispatch), [actions, dispatch]);
};

export const useRefreshWidgets = () => useSelector((s: GlobalState) => s.refreshWidgets);
