import {CardHeader} from '@material-ui/core';
import {green} from '@material-ui/core/colors';
import {useSummaryResults} from 'components/dashboard/useSummaryResults';
import {BigLoader} from 'components/loaders';
import {SummaryCategory} from 'components/transactions/SummaryCategory';
import * as React from 'react';
import {useSelectedProject} from 'state/projects';
import {User} from 'types';

export const UsersTab = ({reportQueryParams}: {reportQueryParams: string}) => {
    const users = useSelectedProject().users;
    const results = useSummaryResults({reportQueryParams});

    return (
        <>
            <CardHeader title="Users" />
            {results ? (
                <SummaryCategory<User>
                    {...{
                        backgroundColor: green[500],
                        title: 'Balance by Person',
                        summaryObject: results.remainingData.byUser,
                        entities: users,
                        entityNameField: 'full_name',
                    }}
                />
            ) : (
                <BigLoader />
            )}
        </>
    );
};
