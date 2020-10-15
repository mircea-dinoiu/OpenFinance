import {SummaryResults} from 'components/transactions/types';
import {routes} from 'defs/routes';
import * as React from 'react';
import {useRefreshWidgets} from 'state/hooks';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';

export const useSummaryResults = ({reportQueryParams}: {reportQueryParams: string}) => {
    const [results, setResults] = React.useState<SummaryResults | null>(null);
    const refreshWidgets = useRefreshWidgets();

    const load = async () => {
        const response = await createXHR<SummaryResults>({
            url: makeUrl(routes.reports.summary, reportQueryParams),
        });
        const json = response.data;

        setResults(json);
    };

    React.useEffect(() => {
        load();
    }, [reportQueryParams, refreshWidgets]);

    return results;
};