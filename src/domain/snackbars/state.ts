import {useSelector} from 'react-redux';
import {GlobalState, Snackbar} from 'types';

export const useSnackbars = (): Snackbar[] => useSelector((s: GlobalState) => s.snackbars);
