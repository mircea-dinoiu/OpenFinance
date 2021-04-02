import {Snackbar} from 'domain/snackbars/defs';
import {useSelector} from 'react-redux';
import {GlobalState} from 'state/defs';

export const useSnackbars = (): Snackbar[] => useSelector((s: GlobalState) => s.snackbars);
