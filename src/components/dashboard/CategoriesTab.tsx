import {CardHeader} from '@material-ui/core';
import {purple} from '@material-ui/core/colors';
import {useSummaryResults} from 'components/dashboard/useSummaryResults';
import {BigLoader} from 'components/loaders';
import {SummaryCategory} from 'components/transactions/SummaryCategory';
import * as React from 'react';
import {useCategories} from 'state/hooks';

export const CategoriesTab = ({reportQueryParams}: {reportQueryParams: string}) => {
    const categories = useCategories();
    const results = useSummaryResults({reportQueryParams});

    return (
        <>
            <CardHeader title="Categories" />

            {results ? (
                <SummaryCategory
                    {...{
                        backgroundColor: purple[500],
                        title: 'Transactions by Category',
                        summaryObject: results.expensesByCategory,
                        entities: categories,
                        entityNameField: 'name',
                    }}
                />
            ) : (
                <BigLoader />
            )}
        </>
    );
};
