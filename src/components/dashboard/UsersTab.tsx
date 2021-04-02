import {CardHeader} from '@material-ui/core';
import {useSummaryResults} from 'components/dashboard/useSummaryResults';
import {BigLoader} from 'components/loaders';
import {SummaryCategory} from 'components/transactions/SummaryCategory';
import {User} from 'domain/users/defs';
import * as React from 'react';
import {useSelectedProject} from 'state/projects';

export const UsersTab = ({reportQueryParams}: {reportQueryParams: string}) => {
    const users = useSelectedProject().users;
    const results = useSummaryResults({reportQueryParams});

    return (
        <>
            <CardHeader title="Users" />
            {results ? (
                <SummaryCategory<User>
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
