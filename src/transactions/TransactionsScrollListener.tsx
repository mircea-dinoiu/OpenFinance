import {useLocation, useHistory} from 'react-router-dom';
import {useTransactionsState} from 'transactions/TransactionsContext';
import {useTransactionsParams} from 'transactions/useTransactionsParams';
import useEventListener from '@use-it/event-listener';
import {scrollReachedBottom} from 'app/scroll';
import {QueryParam} from 'app/QueryParam';

export const TransactionsScrollListener = () => {
    const location = useLocation();
    const history = useHistory();
    const [{loading}] = useTransactionsState();
    const {page} = useTransactionsParams();

    useEventListener('scroll', () => {
        if (!loading && scrollReachedBottom(document.scrollingElement as HTMLElement)) {
            const searchParams = new URLSearchParams(location.search);

            searchParams.set(QueryParam.page, String(page + 1));
            history.replace({
                ...location,
                search: searchParams.toString(),
            });
        }
    });

    return null;
};
