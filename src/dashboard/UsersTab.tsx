import {CardHeader} from '@material-ui/core';
import {useSummaryResults} from 'dashboard/useSummaryResults';
import {BigLoader} from 'app/loaders';
import {SummaryCategory} from 'transactions/SummaryCategory';
import {TUser} from 'users/defs';
import * as React from 'react';
import {useSelectedProject} from 'projects/state';

export const UsersTab = ({reportQueryParams}: {reportQueryParams: string}) => {
    const users = useSelectedProject().users;
    const results = useSummaryResults({reportQueryParams});

    return (
        <>
            <CardHeader title="Users" />
            {results ? (
                <SummaryCategory<TUser>
                    summaryObject={results.remainingData.byUser}
                    entities={users}
                    entityNameField="full_name"
                />
            ) : (
                <BigLoader />
            )}
        </>
    );
};
