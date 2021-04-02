import {Chip, styled} from '@material-ui/core';
import {TransactionModel} from 'transactions/defs';
import {useCategories} from 'categories/state';
import * as React from 'react';

export const CategoriesDisplay = ({item}: {item: TransactionModel}) => {
    const categories = useCategories();

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
            }}
        >
            {categories.map((each) =>
                item.categories.includes(each.id) ? (
                    <StyledChip key={each.id} color="primary" label={each.name} />
                ) : null,
            )}
        </div>
    );
};

const StyledChip = styled(Chip)(({theme}) => ({
    margin: theme.spacing(1, 1, 0, 0),

    [theme.breakpoints.up('lg')]: {
        marginTop: 0,
        height: 'auto',
    },
}));
