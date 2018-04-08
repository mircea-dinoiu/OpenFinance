// @flow
import React, {PureComponent} from 'react';
import {groupBy, sortBy} from 'lodash';
import {
    Card, CardHeader, CardText, Table, TableBody, TableRow, TableRowColumn,
} from 'material-ui';
import {numericValue} from 'mobile/ui/formatters';
import {connect} from 'react-redux';
import Expand from 'material-ui-icons/ExpandMore';
import Collapse from 'material-ui-icons/ExpandLess';
import {Col, Row} from 'react-grid-system';

class SummarySubCategory extends PureComponent {
    state = {
        expanded: Boolean(this.props.expandedByDefault),
    };

    numericValue = (...args) => {
        return this.props.numericValueFn(...args);
    };

    toggleExpanded = () => this.setState({expanded: !this.state.expanded});

    render() {
        const {shouldGroup, entities, id, entityIdField, entityNameField, items} = this.props;

        return (
            <React.Fragment>
                {shouldGroup && (
                    <CardHeader
                        style={{
                            paddingTop: 0,
                            paddingBottom: 0,
                            marginTop: id == 0 ? 5 : 0,
                            cursor: 'pointer'
                        }}
                        onClick={this.toggleExpanded}
                    >
                        <Row>
                            <Col xs={11}>
                            {id == 0 ? <em>Unclassified</em> : entities.find(each => each.get(entityIdField) == id).get(entityNameField)}
                            <div style={{fontSize: '10px'}}>
                                {this.numericValue(
                                    items.reduce((acc, each) => acc + each.sum, 0)
                                )}
                            </div>
                            </Col>
                            <Col xs={1}>
                                {this.state.expanded ? <Collapse/> : <Expand/>}
                            </Col>
                        </Row>
                    </CardHeader>
                )}
                {(shouldGroup === false || this.state.expanded) && (
                    <Table>
                        <TableBody displayRowCheckbox={false}>
                            {items.map((each, index) => (
                                <TableRow selectable={false} key={index} style={{marginBottom: 5}}>
                                    <TableRowColumn>{each.description}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right'}}>{this.numericValue(each.sum)}</TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </React.Fragment>
        );
    }
}

class SummaryCategory extends PureComponent {
    state = {
        expanded: Boolean(this.props.expandedByDefault),
    };

    numericValue = (value, opts = {}) => {
        const currency = this.props.currencies.getIn(['map', String(this.props.currencies.get('default')), 'iso_code']);

        return numericValue(value, {...opts, currency});
    };

    handleExpandChange = (expanded) => {
        this.setState({expanded});
    };

    static defaultProps = {
        showSumInHeader: true,
    };

    groupSorter = ([id, items]) => {
        if (items.length && items[0].hasOwnProperty('index')) {
            return items[0].index;
        }

        return id;
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
                style={{marginBottom: 10}}
                expanded={this.state.expanded}
                onExpandChange={this.handleExpandChange}
            >
                <CardHeader
                    style={{backgroundColor, paddingTop: 0}}
                    actAsExpander={true}
                    showExpandableButton={true}
                >
                    <div style={{color: headerColor}}>
                        {title}
                        {showSumInHeader && (
                            <div style={{fontSize: '12px'}}>
                                {this.numericValue(summaryObject.reduce((acc, each) => acc + each.sum, 0), {currencyStyle: {color: headerColor}})}
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardText style={{padding: '0 5px'}} expandable={true}>
                    {sortBy(Object.entries(groupBy(summaryObject, 'group')), this.groupSorter).map(([id, items]) => {
                        const shouldGroup = items.every(each => each.hasOwnProperty('group'));

                        return (
                            <SummarySubCategory
                                key={id}
                                shouldGroup={shouldGroup}
                                id={id}
                                items={items}
                                numericValueFn={this.numericValue}
                                entities={entities}
                                entityIdField={entityIdField}
                                entityNameField={entityNameField}
                                expandedByDefault={expandedByDefault}
                            />
                        );
                    })}
                </CardText>
            </Card>
        );
    }
}

export default connect(({currencies}) => ({currencies}))(SummaryCategory);