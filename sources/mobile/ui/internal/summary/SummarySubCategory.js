// @flow

import React, {PureComponent} from 'react';
import {CardHeader} from 'material-ui';
import {Row, Col} from 'react-grid-system';
import {convertCurrencyToDefault} from 'common/helpers/currency';
import Collapse from '@material-ui/icons/ExpandLess';
import Expand from '@material-ui/icons/ExpandMore';
import BaseTable from 'common/components/BaseTable';
import {FormControlLabel, Checkbox} from '@material-ui/core';

export class SummarySubCategory extends PureComponent {
    state = {
        expanded: Boolean(this.props.expandedByDefault),
    };

    numericValue = (...args) => this.props.numericValueFn(...args);

    toggleExpanded = () => this.setState({expanded: !this.state.expanded});

    render() {
        const {
            shouldGroup,
            entities,
            id,
            entityIdField,
            entityNameField,
            items,
            renderDescription,
        } = this.props;

        return (
            <div style={{padding: '0 5px'}}>
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
                                <div style={{fontSize: '12px'}}>
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
                            <Col xs={2} style={{textAlign: 'right'}}>
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
                        hideHeader={true}
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
