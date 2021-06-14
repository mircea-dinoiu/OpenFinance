import {useLocation} from 'react-router-dom';
import {useMemo} from 'react';
import {QueryParam} from 'app/QueryParam';
import {useEndDate} from '../app/dates/helpers';
import {SortingRule, Filter} from 'react-table-6';

export type TransactionsParams = {
    pageSize: number;
    page: number;
    sorters: SortingRule[];
    filters: Filter[];
    endDate: string;
};

export const useTransactionsParams = () => {
    const location = useLocation();
    const [endDate] = useEndDate();

    return useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        return {
            pageSize: JSON.parse(searchParams.get(QueryParam.pageSize) as string) ?? 30,
            page: JSON.parse(searchParams.get(QueryParam.page) as string) ?? 1,
            sorters: JSON.parse(searchParams.get(QueryParam.sorters) as string) ?? [
                {
                    id: 'created_at',
                    desc: true,
                },
            ],
            filters: JSON.parse(searchParams.get(QueryParam.filters) as string) ?? [],
            endDate,
        };
    }, [location.search, endDate]);
};
