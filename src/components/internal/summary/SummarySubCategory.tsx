import React, {PureComponent} from 'react';
import {CardHeader} from 'material-ui';
import {convertCurrencyToDefault} from 'helpers/currency';
import Collapse from '@material-ui/icons/ExpandLess';
import Expand from '@material-ui/icons/ExpandMore';
import {BaseTable} from 'components/BaseTable';
import {Checkbox, FormControlLabel} from '@material-ui/core';
import {TypeCurrencies} from 'types';
import {spacingMedium, spacingSmall} from 'defs/styles';
import styled from 'styled-components';
import {sortBy} from 'lodash';

export class SummarySubCategory extends PureComponent<
    {
        expandedByDefault: boolean;
        numericValueFn: (
            value: number,
            opts: {
                currencyId?: number;
                currencyStyle?: {};
            },
        ) => string;
        excluded: {};
        currencies: TypeCurrencies;
        onToggleExcluded: (boolean) => void;
        entities: [];
        entityIdField: string;
        entityNameField: string;
        id: string;
        items: {description: string}[];
        renderDescription: (cat: {description: string}) => void;
        shouldGroup: boolean;
    },
    {
        expanded: boolean;
    }
> {
    state = {
        expanded: Boolean(this.props.expandedByDefault),
    };

    numericValue = (value, opts?) => this.props.numericValueFn(value, opts);

    toggleExpanded = () => this.setState({expanded: !this.state.expanded});

    render() {
        const {
            shouldGroup,
            entities,
            id,
            entityIdField,
            entityNameField,
            items: itemsFromProps,
            renderDescription,
        } = this.props;

        const items = sortBy(itemsFromProps, (item) => item.description);

        return (
            <div style={{padding: '0 5px'}}>
                {shouldGroup && (
                    <CardHeader
                        style={{
                            padding: 0,
                            marginTop: Number(id) === 0 ? 5 : 0,
                            cursor: 'pointer',
                        }}
                        onClick={this.toggleExpanded}
                    >
                        <CategoryContainer>
                            <div>
                                {Number(id) === 0 ? (
                                    <em>Unclassified</em>
                                ) : (
                                    entities.find(
                                        (each) => each[entityIdField] == id,
                                    )[entityNameField]
                                )}
                                <div style={{fontSize: '12px'}}>
                                    {this.numericValue(
                                        items.reduce(
                                            // @ts-ignore
                                            (
                                                acc,
                                                each: {
                                                    reference: string;
                                                    currencyId: number;
                                                    sum: number;
                                                },
                                            ) =>
                                                acc +
                                                (this.props.excluded[
                                                    each.reference
                                                ]
                                                    ? 0
                                                    : convertCurrencyToDefault(
                                                          each.sum,
                                                          each.currencyId,
                                                          this.props.currencies,
                                                      )),
                                            0,
                                        ),
                                    )}
                                </div>
                            </div>
                            <CategoryToggle>
                                {this.state.expanded ? (
                                    <Collapse />
                                ) : (
                                    <Expand />
                                )}
                            </CategoryToggle>
                        </CategoryContainer>
                    </CardHeader>
                )}
                {(shouldGroup === false || this.state.expanded) && (
                    <BaseTable
                        data={items}
                        hideHeader={true}
                        columns={[
                            {
                                id: 'description',
                                accessor: (each) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                style={{
                                                    padding: `0 ${spacingSmall} 0 ${spacingMedium}`,
                                                }}
                                                checked={
                                                    !this.props.excluded[
                                                        each.reference
                                                    ]
                                                }
                                                onChange={() =>
                                                    this.props.onToggleExcluded(
                                                        each.reference,
                                                    )
                                                }
                                                color="default"
                                            />
                                        }
                                        label={
                                            <span style={{fontWeight: 300}}>
                                                {renderDescription
                                                    ? renderDescription(each)
                                                    : each.description}
                                            </span>
                                        }
                                    />
                                ),
                            },
                            {
                                id: 'sum',
                                accessor: (each) =>
                                    this.numericValue(each.sum, {
                                        currencyId: each.currencyId,
                                    }),
                                style: {textAlign: 'right'},
                            },
                        ]}
                    />
                )}
            </div>
        );
    }
}

const CategoryContainer = styled.div`
    display: grid;
    grid-template-columns: 10fr 2fr;
`;

const CategoryToggle = styled.div`
    text-align: right;
`;
