// @flow
import { convertCurrencyToDefault } from 'common/helpers/currency';

import React, { PureComponent } from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { Card, CardHeader, CardText } from 'material-ui';
import { numericValue } from 'mobile/ui/formatters';
import { connect } from 'react-redux';
import Expand from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/icons/ExpandLess';
import { Col, Row } from 'react-grid-system';
import BaseTable from 'common/components/BaseTable';
import { financialNum } from 'shared/utils/numbers';
import { FormControlLabel, Checkbox } from '@material-ui/core';

class SummarySubCategory extends PureComponent {
    state = {
        expanded: Boolean(this.props.expandedByDefault),
    };

    numericValue = (...args) => this.props.numericValueFn(...args);

    toggleExpanded = () => this.setState({ expanded: !this.state.expanded });

    render() {
        const {
            shouldGroup,
            entities,
            id,
            entityIdField,
            entityNameField,
            items,
        } = this.props;

        return (
            <div style={{ padding: '0 5px' }}>
                {shouldGroup && (
                    <CardHeader
                        style={{
                            padding: 0,
                            marginTop: id == 0 ? 5 : 0,
                            cursor: 'pointer',
                        }}
                        onClick={this.toggleExpanded}
                    >
                        <Row>
                            <Col xs={10}>
                                {id == 0 ? (
                                    <em>Unclassified</em>
                                ) : (
                                    entities
                                        .find(
                                            (each) =>
                                                each.get(entityIdField) == id,
                                        )
                                        .get(entityNameField)
                                )}
                                <div style={{ fontSize: '10px' }}>
                                    {this.numericValue(
                                        items.reduce(
                                            (acc, each) =>
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
                            </Col>
                            <Col xs={2} style={{ textAlign: 'right' }}>
                                {this.state.expanded ? (
                                    <Collapse />
                                ) : (
                                    <Expand />
                                )}
                            </Col>
                        </Row>
                    </CardHeader>
                )}
                {(shouldGroup === false || this.state.expanded) && (
                    <BaseTable
                        data={items}
                        modifiers={{ hideHeader: true }}
                        columns={[
                            {
                                id: 'description',
                                accessor: (each) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                style={{
                                                    padding: '0 5px 0 10px',
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
                                            <span style={{ fontWeight: 300 }}>
                                                {each.description}
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
                                style: { textAlign: 'right' },
                            },
                        ]}
                    />
                )}
            </div>
        );
    }
}

class SummaryCategory extends PureComponent {
    state = {
        expanded: Boolean(this.props.expandedByDefault),
        excluded: {},
    };

    numericValue = (
        value,
        { currencyId = this.props.currencies.default, ...opts } = {},
    ) => {
        const currency = this.props.currencies.map[currencyId].iso_code;

        return numericValue(value, { ...opts, currency });
    };

    handleExpandChange = (expanded) => {
        this.setState({ expanded });
    };

    static defaultProps = {
        showSumInHeader: true,
    };

    groupSorter = ([, items]) => {
        if (items.length > 0) {
            // $FlowFixMe
            const [firstItem] = items;

            if (firstItem.index != null) {
                return firstItem.index;
            }

            if (firstItem.group != null) {
                return firstItem.group;
            }
        }

        return 0;
    };

    handleToggleExcluded = (id) => {
        this.setState((state) => ({
            excluded: { ...state.excluded, [id]: !state.excluded[id] },
        }));
    };

    render() {
        const {
            backgroundColor,
            title,
            summaryObject,
            expandedByDefault,
            entities,
            entityIdField = 'id',
            entityNameField = 'name',
            showSumInHeader,
        } = this.props;
        const headerColor = 'rgba(255, 255, 255, 0.9)';

        return (
            <Card
                style={{ marginBottom: 10 }}
                expanded={this.state.expanded}
                onExpandChange={this.handleExpandChange}
            >
                <CardHeader
                    style={{ backgroundColor, paddingTop: 0 }}
                    actAsExpander={true}
                    showExpandableButton={true}
                >
                    <div style={{ color: headerColor }}>
                        {title}
                        {showSumInHeader && (
                            <div style={{ fontSize: '12px' }}>
                                {this.numericValue(
                                    financialNum(
                                        summaryObject.reduce(
                                            (acc, each) =>
                                                acc +
                                                (this.state.excluded[
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
                                    ),
                                    { currencyStyle: { color: headerColor } },
                                )}
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardText style={{ padding: '0 5px' }} expandable={true}>
                    {sortBy(
                        Object.entries(groupBy(summaryObject, 'group')),
                        this.groupSorter,
                    ).map(([id, items]) => {
                        const shouldGroup = items.every((each) =>
                            each.hasOwnProperty('group'),
                        );

                        return (
                            <SummarySubCategory
                                key={id}
                                excluded={this.state.excluded}
                                shouldGroup={shouldGroup}
                                id={id}
                                items={items}
                                numericValueFn={this.numericValue}
                                entities={entities}
                                entityIdField={entityIdField}
                                entityNameField={entityNameField}
                                expandedByDefault={expandedByDefault}
                                currencies={this.props.currencies}
                                onToggleExcluded={this.handleToggleExcluded}
                            />
                        );
                    })}
                </CardText>
            </Card>
        );
    }
}

export default connect(({ currencies }) => ({ currencies }))(SummaryCategory);
