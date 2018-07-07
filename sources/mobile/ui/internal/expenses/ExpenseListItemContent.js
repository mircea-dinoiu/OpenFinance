import React from 'react';

import { Row, Col } from 'react-grid-system';

import { Flags } from 'mobile/ui/internal/common/MainScreenFlags';
import MoneyLocationDisplay from 'common/components/FinancialTable/cells/MoneyLocationDisplay';
import RepeatsDisplay from 'common/components/FinancialTable/cells/RepeatsDisplay';
import DateDisplay from 'common/components/FinancialTable/cells/DateDisplay';
import CategoriesDisplay from 'mobile/ui/internal/expenses/cells/CategoriesDisplay';
import AmountDisplay from 'common/components/FinancialTable/cells/AmountDisplay';
import PersonsDisplay from 'mobile/ui/internal/expenses/cells/PersonsDisplay';

const ExpenseListItemContent = ({ item, expanded }) => {
    const personsDisplay = <PersonsDisplay item={item} />;
    const descriptionDisplay = item.item;
    const flags = <Flags entity="expense" item={item} />;
    const moneyLocationDisplay = <MoneyLocationDisplay item={item} />;
    const categoriesDisplay = <CategoriesDisplay item={item} />;
    const dateDisplay = <DateDisplay item={item} />;
    const repeatsDisplay = <RepeatsDisplay item={item} />;

    return (
        <div>
            <Row>
                <Col xs={6}>{descriptionDisplay}</Col>
                <Col xs={6} style={{ textAlign: 'right' }}>
                    {personsDisplay}
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <span
                        style={{
                            fontSize: 14,
                            float: 'left',
                            lineHeight: '20px',
                        }}
                    >
                        <AmountDisplay showCurrency={true} item={item} />
                    </span>
                    &nbsp;
                    {flags}
                </Col>
                <Col xs={6} style={{ textAlign: 'right' }}>
                    {moneyLocationDisplay}
                </Col>
            </Row>
            {expanded && (
                <div>
                    <Row>
                        <Col xs={6}>{dateDisplay}</Col>
                        <Col xs={6} style={{ textAlign: 'right' }}>
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
