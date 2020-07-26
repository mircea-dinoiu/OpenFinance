import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {AmountDisplay} from 'components/BaseTable/cells/AmountDisplay';
import {DateDisplay} from 'components/BaseTable/cells/DateDisplay';
import {MoneyLocationDisplay} from 'components/BaseTable/cells/MoneyLocationDisplay';
import {RepeatsDisplay} from 'components/BaseTable/cells/RepeatsDisplay';
import {CategoriesDisplay} from 'components/transactions/cells/CategoriesDisplay';
import {PersonsDisplay} from 'components/transactions/cells/PersonsDisplay';
import {Flags} from 'components/transactions/MainScreenFlags';
import {TransactionModel} from 'components/transactions/types';
import {spacingMedium, spacingSmall} from 'defs/styles';
import * as React from 'react';
import styled from 'styled-components';

const useStyles = makeStyles({
    expenseListItemContent: {
        display: 'grid',
        gridGap: spacingSmall,
        alignItems: 'center',
        gridTemplateAreas: `
        'description description persons'
        'amount amount ml'
`,
    },
    expenseListItemContentExpanded: {
        gridTemplateAreas: `
        'description description persons'
        'amount amount ml'
        'date date repeats'
        'categories categories categories'
`,
    },
});

const DescriptionContainer = styled.div`
    grid-area: description;
`;

const PersonsContainer = styled.div`
    grid-area: persons;
    text-align: right;
`;

const AmountContainer = styled.div`
    grid-area: amount;
    font-size: 1rem;
    line-height: 20px;
    display: flex;
    flex-direction: row;
`;

const FlagsContainer = styled.div`
    margin-left: ${spacingMedium};
`;

const MlContainer = styled.div`
    text-align: right;
    grid-area: ml;
`;

const DateContainer = styled.div`
    grid-area: date;
`;
const RepeatsContainer = styled.div`
    text-align: right;
    grid-area: repeats;
`;

const CategoriesContainer = styled.div`
    grid-area: categories;
`;

export const ExpenseListItemContent = ({item, expanded}: {
    item: TransactionModel,
    expanded?: boolean
}) => {
    const cls = useStyles();
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
        <div
            className={clsx(
                cls.expenseListItemContent,
                expanded && cls.expenseListItemContentExpanded,
            )}
        >
            <DescriptionContainer>{descriptionDisplay}</DescriptionContainer>
            <PersonsContainer>{personsDisplay}</PersonsContainer>
            <AmountContainer>
                <AmountDisplay item={item} />
                <FlagsContainer>{flags}</FlagsContainer>
            </AmountContainer>
            <MlContainer>{moneyLocationDisplay}</MlContainer>

            {expanded && (
                <>
                    <DateContainer>{dateDisplay}</DateContainer>
                    <RepeatsContainer>{repeatsDisplay}</RepeatsContainer>
                    <CategoriesContainer>
                        {categoriesDisplay}
                    </CategoriesContainer>
                </>
            )}
        </div>
    );
};
