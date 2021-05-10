import {TransactionModel} from 'transactions/defs';
import {useCategories} from 'categories/state';
import * as React from 'react';

export const CategoriesDisplay = ({item}: {item: TransactionModel}) => {
    const categories = useCategories();
    const categoryNames = categories.filter((c) => item.categories.includes(c.id)).map((c) => c.name);

    return <>{categoryNames.join(', ')}</>;
};
