import * as React from 'react';
import {Chip} from '@material-ui/core';
import {useCategories, useScreenSize} from 'state/hooks';
import {spacingSmall} from 'defs/styles';
import {TransactionModel} from 'types';

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
                            background: each.color,
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
