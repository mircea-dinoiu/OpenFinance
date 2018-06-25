// @flow
import React from 'react';
import moment from 'moment';

import {Row, Col} from 'react-grid-system';

import {grey500, grey700} from 'material-ui/styles/colors';
import {Avatar, TableRowColumn} from 'material-ui';
import {numericValue} from '../../formatters';

import RepeatOptions from 'common/defs/repeatOptions';
import {connect} from 'react-redux';
import {ColumnStyles} from 'mobile/ui/internal/incomes/defs';
import {Flags} from 'mobile/ui/internal/common/MainScreenFlags';

type TypeProps = {};

const IncomeListItemContent = (props: TypeProps) => {
    const item = props.item;
    const userList = props.data.user.get('list');
    const currenciesMap = props.data.currencies.get('map');
    const currencyISOCode = currenciesMap.getIn([
        String(item.currency_id),
        'iso_code'
    ]);
    const screen = props.screen;
    const descriptionDisplay = item.description;
    const flags = <Flags entity="income" item={item} />;
    const destinationDisplay = item.money_location_id && (
        <span style={{fontSize: 14, color: grey700}}>
            {props.data.moneyLocations
                .find((each) => each.get('id') === item.money_location_id)
                .get('name')}
        </span>
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
    const fromDisplay = userList.map(
        (each) =>
            item.user_id === each.get('id') ? (
                <Avatar
                    key={each.get('id')}
                    src={each.get('avatar')}
                    size={20}
                    style={{marginLeft: 5}}
                />
            ) : null
    );

    if (screen.isLarge) {
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
                    <span style={{float: 'left', marginRight: 5}}>
                        {flags}
                    </span>
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
                <TableRowColumn style={ColumnStyles.DESTINATION}>
                    {destinationDisplay}
                </TableRowColumn>
                <TableRowColumn style={ColumnStyles.PERSON}>
                    {fromDisplay}
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
                    {fromDisplay}
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
                    {item.money_location_id && destinationDisplay}
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
                </div>
            )}
        </div>
    );
};

export default connect(({screen, user, currencies, moneyLocations}) => ({
    screen,
    data: {user, currencies, moneyLocations}
}))(IncomeListItemContent);
