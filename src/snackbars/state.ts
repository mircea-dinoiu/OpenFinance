import {Snackbar} from 'snackbars/defs';
import {useSelector} from 'react-redux';
import {GlobalState} from 'app/state/defs';

export const useSnackbars = (): Snackbar[] => useSelector((s: GlobalState) => s.snackbars);
