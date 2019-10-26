import * as React from 'react';
import {Flags} from 'components/internal/common/MainScreenFlags';
import MoneyLocationDisplay from 'components/BaseTable/cells/MoneyLocationDisplay';
import RepeatsDisplay from 'components/BaseTable/cells/RepeatsDisplay';
import DateDisplay from 'components/BaseTable/cells/DateDisplay';
import CategoriesDisplay from 'components/internal/expenses/cells/CategoriesDisplay';
import AmountDisplay from 'components/BaseTable/cells/AmountDisplay';
import PersonsDisplay from 'components/internal/expenses/cells/PersonsDisplay';
import styled from 'styled-components';

const ExpenseListItemContentStyled = styled.div`
    display: grid;
    grid-template-areas:
        'description description persons'
        'amount flags ml'
        'date date repeats'
        'categories categories categories';
`;

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
`;

const FlagsContainer = styled.div`
    grid-area: flags;
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

export const ExpenseListItemContent = ({item, expanded}) => {
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
        <ExpenseListItemContentStyled>
            <DescriptionContainer>{descriptionDisplay}</DescriptionContainer>
            <PersonsContainer>{personsDisplay}</PersonsContainer>
            <AmountContainer>
                <AmountDisplay showCurrency={true} item={item} />
            </AmountContainer>
            <FlagsContainer>{flags}</FlagsContainer>
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
        </ExpenseListItemContentStyled>
    );
};
