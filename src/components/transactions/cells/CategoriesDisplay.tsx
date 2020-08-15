import {Chip} from '@material-ui/core';
import {TransactionModel} from 'components/transactions/types';
import {spacingSmall} from 'defs/styles';
import * as React from 'react';
import {useCategories, useScreenSize} from 'state/hooks';

export const CategoriesDisplay = ({item}: {item: TransactionModel}) => {
    const categories = useCategories();
    const screen = useScreenSize();

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
                        style={{
                            margin: `${
                                screen.isLarge ? 0 : spacingSmall
                            } ${spacingSmall} 0 0`,
                            ...(screen.isLarge
                                ? {
                                      height: 'auto',
                                  }
                                : {}),
                        }}
                        label={each.name}
                    />
                ) : null,
            )}
        </div>
    );
};
