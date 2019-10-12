import * as React from 'react';
import {Row, Col} from 'react-grid-system';
import {Flags} from 'components/internal/common/MainScreenFlags';
import MoneyLocationDisplay from 'components/BaseTable/cells/MoneyLocationDisplay';
import RepeatsDisplay from 'components/BaseTable/cells/RepeatsDisplay';
import DateDisplay from 'components/BaseTable/cells/DateDisplay';
import CategoriesDisplay from 'components/internal/expenses/cells/CategoriesDisplay';
import AmountDisplay from 'components/BaseTable/cells/AmountDisplay';
import PersonsDisplay from 'components/internal/expenses/cells/PersonsDisplay';

const ExpenseListItemContent = ({item, expanded}) => {
    const personsDisplay = <PersonsDisplay item={item} />;
    const descriptionDisplay = item.item;
    const flags = <Flags entity="transaction" item={item} />;
    const moneyLocationDisplay = (
        <MoneyLocationDisplay id={item.money_location_id} />
    );
    const categoriesDisplay = <CategoriesDisplay item={item} />;
    const dateDisplay = <DateDisplay item={item} />;
    const repeatsDisplay = <RepeatsDisplay item={item} />;

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
                            fontSize: '1rem',
                            float: 'left',
                            lineHeight: '20px',
                        }}
                    >
                        <AmountDisplay showCurrency={true} item={item} />
                    </span>
                    &nbsp;
                    {flags}
                </Col>
                <Col xs={6} style={{textAlign: 'right'}}>
                    {moneyLocationDisplay}
                </Col>
            </Row>
            {expanded && (
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

export default ExpenseListItemContent;
