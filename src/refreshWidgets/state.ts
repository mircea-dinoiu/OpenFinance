import {Action, GlobalState} from 'app/state/defs';
import uniqueId from 'lodash/uniqueId';
import {useSelector} from 'react-redux';

export const useRefreshWidgets = () => useSelector((s: GlobalState) => s.refreshWidgets);
export const refreshWidgets = () => ({type: Action.REFRESH_WIDGETS});
export const refreshWidgetsReducer = (
    state = uniqueId(),
    action: {
        type: Action;
    },
) => (action.type === Action.REFRESH_WIDGETS ? uniqueId() : state);
