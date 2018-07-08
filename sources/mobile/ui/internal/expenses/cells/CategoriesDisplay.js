// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Chip } from 'material-ui';

const CategoriesDisplay = ({ item, categories, screen }) => (
    <div
        style={{
            display: 'flex',
            flexWrap: 'wrap',
        }}
    >
        {categories.map(
            (each) =>
                item.categories.includes(each.get('id')) ? (
                    <Chip
                        key={each.get('id')}
                        style={{
                            margin: `${screen.isLarge ? 0 : '5px'} 5px 0 0`,
                        }}
                        labelStyle={
                            screen.isLarge
                                ? {
                                    lineHeight: 'inherit',
                                }
                                : {}
                        }
                    >
                        {each.get('name')}
                    </Chip>
                ) : null,
        )}
    </div>
);
const mapStateToProps = ({ categories, screen }) => ({ categories, screen });

export default connect(mapStateToProps)(CategoriesDisplay);
