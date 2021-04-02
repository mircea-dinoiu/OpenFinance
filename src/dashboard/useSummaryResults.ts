import {SummaryResults} from 'transactions/defs';
import {Api} from 'app/Api';
import * as React from 'react';
import {useRefreshWidgets} from 'app/state/hooks';
import {createXHR} from 'app/utils/fetch';
import {makeUrl} from 'app/utils/url';

export const useSummaryResults = ({reportQueryParams}: {reportQueryParams: string}) => {
    const [results, setResults] = React.useState<SummaryResults | null>(null);
    const refreshWidgets = useRefreshWidgets();

    const load = async () => {
        const response = await createXHR<SummaryResults>({
            url: makeUrl(Api.reports.summary, reportQueryParams),
        });
        const json = response.data;

        setResults(json);
    };

    React.useEffect(() => {
        load();
    }, [reportQueryParams, refreshWidgets]);

    return results;
};
