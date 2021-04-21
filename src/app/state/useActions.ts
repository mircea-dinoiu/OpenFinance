import * as React from 'react';
import {useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';

export const useActions = <T>(actions: T): T => {
    const dispatch = useDispatch();

    // @ts-ignore
    return React.useMemo(() => bindActionCreators(actions, dispatch), [actions, dispatch]);
};
