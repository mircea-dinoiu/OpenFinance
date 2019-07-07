// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Chip } from '@material-ui/core';

const CategoriesDisplay = ({ item, categories, screen }) => (
    <div
        style={{
            display: 'flex',
            flexWrap: 'wrap',
        }}
    >
        {categories.map((each) =>
            item.categories.includes(each.get('id')) ? (
                <Chip
                    key={each.get('id')}
                    style={{
                        background: each.get('color'),
                        margin: `${screen.isLarge ? 0 : '5px'} 5px 0 0`,
                        ...(screen.isLarge
                            ? {
                                height: 'auto',
                            }
                            : {}),
                    }}
                    label={each.get('name')}
                />
            ) : null,
        )}
    </div>
);
const mapStateToProps = ({ categories, screen }) => ({ categories, screen });

export default connect(mapStateToProps)(CategoriesDisplay);
