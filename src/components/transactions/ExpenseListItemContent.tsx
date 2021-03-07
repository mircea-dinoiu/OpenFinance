import {makeStyles, styled} from '@material-ui/core/styles';
import clsx from 'clsx';
import {AmountDisplay} from 'components/BaseTable/cells/AmountDisplay';
import {DateDisplay} from 'components/BaseTable/cells/DateDisplay';
import {AccountDisplayById} from 'components/BaseTable/cells/AccountDisplayById';
import {RepeatsDisplay} from 'components/BaseTable/cells/RepeatsDisplay';
import {CategoriesDisplay} from 'components/transactions/cells/CategoriesDisplay';
import {PersonsDisplay} from 'components/transactions/cells/PersonsDisplay';
import {Flags} from 'components/transactions/MainScreenFlags';
import {TransactionModel} from 'components/transactions/types';
import {spacingNormal, spacingSmall} from 'defs/styles';
import * as React from 'react';

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

const DescriptionContainer = styled('div')({gridArea: 'description'});

const PersonsContainer = styled('div')({gridArea: 'persons', textAlign: 'right'});

const AmountContainer = styled('div')({
    gridArea: 'amount',
    fontSize: '1rem',
    lineHeight: '20px',
    display: 'flex',
    flexDirection: 'row',
});

const FlagsContainer = styled('div')({
    marginLeft: spacingNormal,
});

const MlContainer = styled('div')({textAlign: 'right', gridArea: 'ml'});

const DateContainer = styled('div')({gridArea: 'date'});

const RepeatsContainer = styled('div')({textAlign: 'right', gridArea: 'repeats'});

const CategoriesContainer = styled('div')({gridArea: 'categories'});

export const ExpenseListItemContent = ({item, expanded}: {item: TransactionModel; expanded?: boolean}) => {
    const cls = useStyles();
    const personsDisplay = <PersonsDisplay item={item} />;
    const descriptionDisplay = item.item;
    const flags = <Flags entity="transaction" item={item} />;
    const moneyLocationDisplay = <AccountDisplayById id={item.money_location_id} />;
    const categoriesDisplay = <CategoriesDisplay item={item} />;
    const dateDisplay = <DateDisplay item={item} />;
    const repeatsDisplay = <RepeatsDisplay item={item} />;

    return (
        <div className={clsx(cls.expenseListItemContent, expanded && cls.expenseListItemContentExpanded)}>
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
        </div>
    );
};
