import React from 'react';
import moment from 'moment';

import {Row, Col} from 'react-grid-system';

import {grey500, grey700} from 'material-ui/styles/colors';
import {Avatar, Chip, TableRowColumn} from 'material-ui';

import RepeatOptions from 'common/defs/repeatOptions';
import {numericValue} from '../../formatters';
import {connect} from 'react-redux';
import {ColumnStyles} from 'mobile/ui/internal/expenses/defs';
import {Flags} from 'mobile/ui/internal/common/MainScreenFlags';

const ExpenseListItemContent = (props) => {
    const item = props.item;
    const userList = props.data.user.get('list');
    const currenciesMap = props.data.currencies.get('map');
    const currencyISOCode = currenciesMap.getIn([
        String(item.currency_id),
        'iso_code'
    ]);
    const screen = props.screen;

    const personsDisplay = userList.map(
        (each) =>
            item.users.includes(each.get('id')) ? (
                <Avatar
                    key={each.get('id')}
                    src={each.get('avatar')}
                    size={20}
                    style={{marginLeft: 5}}
                />
            ) : null
    );
    const descriptionDisplay = item.item;
    const flags = <Flags entity="expense" item={item} />;
    const accountDisplay = item.money_location_id && (
        <span style={{fontSize: 14, color: grey700}}>
            {props.data.moneyLocations
                .find((each) => each.get('id') === item.money_location_id)
                .get('name')}
        </span>
    );
    const categoriesDisplay = (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap'
            }}
        >
            {props.data.categories.map(
                (each) =>
                    item.categories.includes(each.get('id')) ? (
                        <Chip
                            key={each.get('id')}
                            style={{
                                margin: `${screen.isLarge ? 0 : '5px'} 5px 0 0`
                            }}
                        >
                            {each.get('name')}
                        </Chip>
                    ) : null
            )}
        </div>
    );
    const dateDisplay = (
        <span
            style={{
                fontSize: 14,
                color: screen.isLarge ? 'inherit' : grey500
            }}
        >
            {moment(item.created_at).format('lll')}
        </span>
    );
    const repeatsText = item.repeat
        ? RepeatOptions.filter((each) => each[0] === item.repeat)[0][1]
        : '';
    const repeatsDisplay = (
        <span style={{fontSize: 14, color: grey500}}>
            {screen.isLarge
                ? repeatsText
                : repeatsText ? `Repeats ${repeatsText}` : 'Does not repeat'}
        </span>
    );

    if (props.screen.isLarge) {
        return (
            <React.Fragment>
                <TableRowColumn style={ColumnStyles.CURRENCY}>
                    {currencyISOCode}
                </TableRowColumn>
                <TableRowColumn style={ColumnStyles.AMOUNT}>
                    {numericValue(item.sum, {
                        showCurrency: false,
                        currency: currencyISOCode
                    })}
                </TableRowColumn>
                <TableRowColumn>
                    <span style={{float: 'left'}}>{flags}</span>
                    &nbsp;
                    <span
                        style={{
                            fontSize: 14,
                            float: 'left',
                            lineHeight: '20px'
                        }}
                    >
                        {descriptionDisplay}
                    </span>
                </TableRowColumn>
                <TableRowColumn
                    className="msl__date-column"
                    style={ColumnStyles.DATE_TIME}
                >
                    {dateDisplay}
                </TableRowColumn>
                <TableRowColumn>{categoriesDisplay}</TableRowColumn>
                <TableRowColumn style={ColumnStyles.ACCOUNT}>
                    {accountDisplay}
                </TableRowColumn>
                <TableRowColumn style={ColumnStyles.PERSONS}>
                    {personsDisplay}
                </TableRowColumn>
                <TableRowColumn style={ColumnStyles.REPEAT}>
                    {repeatsDisplay}
                </TableRowColumn>
            </React.Fragment>
        );
    }

    return (
        <div>
            <Row>
                <Col xs={6}>{descriptionDisplay}</Col>
                <Col xs={6} style={{textAlign: 'right'}}>
                    {personsDisplay}
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <span
                        style={{
                            fontSize: 14,
                            float: 'left',
                            lineHeight: '20px'
                        }}
                    >
                        {numericValue(item.sum, {currency: currencyISOCode})}
                    </span>
                    &nbsp;
                    {flags}
                </Col>
                <Col xs={6} style={{textAlign: 'right'}}>
                    {accountDisplay}
                </Col>
            </Row>
            {props.expanded && (
                <div>
                    <Row>
                        <Col xs={6}>{dateDisplay}</Col>
                        <Col xs={6} style={{textAlign: 'right'}}>
                            {repeatsDisplay}
                        </Col>
                    </Row>
                    {categoriesDisplay}
                </div>
            )}
        </div>
    );
};

export default connect(
    ({user, categories, currencies, moneyLocations, screen}) => ({
        screen,
        data: {user, categories, currencies, moneyLocations}
    })
)(ExpenseListItemContent);
