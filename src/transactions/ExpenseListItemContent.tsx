import {styled} from '@material-ui/core/styles';
import {AccountDisplayById} from 'transactions/cells/AccountDisplayById';
import {AmountDisplay} from 'transactions/cells/AmountDisplay';
import {DateDisplay} from 'transactions/cells/DateDisplay';
import {RepeatsDisplay} from 'transactions/cells/RepeatsDisplay';
import {CategoriesDisplay} from 'transactions/cells/CategoriesDisplay';
import {PersonsDisplay} from 'transactions/cells/PersonsDisplay';
import {Flags} from 'transactions/MainScreenFlags';
import {TransactionModel} from 'transactions/defs';
import * as React from 'react';
import {Theme} from '@material-ui/core';

const ExpenseListItemContentStyled = styled('div')(({theme, isExpanded}: {theme: Theme; isExpanded?: boolean}) => ({
    display: 'grid',
    gridGap: theme.spacing(1),
    alignItems: 'center',
    gridTemplateAreas: isExpanded
        ? `
        'description description persons'
        'amount amount ml'
        'date date repeats'
        'categories categories categories'
`
        : `
        'description description persons'
        'amount amount ml'
`,
}));

const DescriptionContainer = styled('div')({gridArea: 'description'});

const PersonsContainer = styled('div')({gridArea: 'persons', textAlign: 'right'});

const AmountContainer = styled('div')({
    gridArea: 'amount',
    fontSize: '1rem',
    lineHeight: '20px',
    display: 'flex',
    flexDirection: 'row',
});

const FlagsContainer = styled('div')(({theme}) => ({
    marginLeft: theme.spacing(2),
}));

const MlContainer = styled('div')({textAlign: 'right', gridArea: 'ml'});

const DateContainer = styled('div')({gridArea: 'date'});

const RepeatsContainer = styled('div')({textAlign: 'right', gridArea: 'repeats'});

const CategoriesContainer = styled('div')({gridArea: 'categories'});

export const ExpenseListItemContent = ({item, expanded}: {item: TransactionModel; expanded?: boolean}) => {
    const personsDisplay = <PersonsDisplay item={item} />;
    const descriptionDisplay = item.item;
    const flags = <Flags entity="transaction" item={item} />;
    const moneyLocationDisplay = <AccountDisplayById id={item.money_location_id} />;
    const categoriesDisplay = <CategoriesDisplay item={item} />;
    const dateDisplay = <DateDisplay item={item} />;
    const repeatsDisplay = <RepeatsDisplay item={item} />;

    return (
        <ExpenseListItemContentStyled isExpanded={expanded}>
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
                    <CategoriesContainer>{categoriesDisplay}</CategoriesContainer>
                </>
            )}
        </ExpenseListItemContentStyled>
    );
};
