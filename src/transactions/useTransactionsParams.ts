import {useLocation} from 'react-router-dom';
import {useMemo} from 'react';
import {QueryParam} from 'app/QueryParam';

export const useTransactionsParams = () => {
    const location = useLocation();

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
        };
    }, [location.search]);
};
