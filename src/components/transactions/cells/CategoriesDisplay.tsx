import {Chip, styled} from '@material-ui/core';
import {TransactionModel} from 'components/transactions/types';
import * as React from 'react';
import {useCategories} from 'state/hooks';

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

const StyledChip = styled(Chip)((props) => ({
    margin: `${props.theme.spacing(1)} ${props.theme.spacing(1)} 0 0`,

    [props.theme.breakpoints.up('lg')]: {
        marginTop: 0,
        height: 'auto',
    },
}));
