import {Chip, Theme, useMediaQuery} from '@material-ui/core';
import {TransactionModel} from 'components/transactions/types';
import {spacingSmall} from 'defs/styles';
import * as React from 'react';
import {useCategories} from 'state/hooks';

export const CategoriesDisplay = ({item}: {item: TransactionModel}) => {
    const categories = useCategories();
    const isLarge = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
            }}
        >
            {categories.map((each) =>
                item.categories.includes(each.id) ? (
                    <Chip
                        key={each.id}
                        color="primary"
                        style={{
                            margin: `${(isLarge ? 0 : spacingSmall)} ${spacingSmall} 0 0`,
                            ...(isLarge ? {
                                height: 'auto',
                            } : {}),
                        }}
                        label={each.name}
                    />
                ) : null,
            )}
        </div>
    );
};
