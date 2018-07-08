// @flow
import React from 'react';
import { Row, Col } from 'react-grid-system';

import { Flags } from 'mobile/ui/internal/common/MainScreenFlags';
import FromDisplay from 'mobile/ui/internal/incomes/cells/FromDisplay';
import AmountDisplay from 'common/components/BaseTable/cells/AmountDisplay';
import RepeatsDisplay from 'common/components/BaseTable/cells/RepeatsDisplay';
import DateDisplay from 'common/components/BaseTable/cells/DateDisplay';
import MoneyLocationDisplay from 'common/components/BaseTable/cells/MoneyLocationDisplay';

type TypeProps = {};

const IncomeListItemContent = ({ item, expanded }: TypeProps) => {
    const descriptionDisplay = item.description;
    const flags = <Flags entity="income" item={item} />;
    const moneyLocationDisplay = <MoneyLocationDisplay item={item} />;
    const dateDisplay = <DateDisplay item={item} />;
    const repeatsDisplay = <RepeatsDisplay item={item} />;
    const fromDisplay = <FromDisplay item={item} />;

    return (
        <div>
            <Row>
                <Col xs={6}>{descriptionDisplay}</Col>
                <Col xs={6} style={{ textAlign: 'right' }}>
                    {fromDisplay}
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
                </div>
            )}
        </div>
    );
};

export default IncomeListItemContent;
