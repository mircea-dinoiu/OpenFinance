import * as React from 'react';
import {Chip} from '@material-ui/core';
import {useCategories, useScreenSize} from 'common/state/hooks';

const CategoriesDisplay = ({item}) => {
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
                            margin: `${screen.isLarge ? 0 : '5px'} 5px 0 0`,
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

export default CategoriesDisplay;
