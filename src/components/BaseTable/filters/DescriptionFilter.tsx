import * as React from 'react';
import {SyntheticEvent} from 'react';
import {IconButton, IconMenu, RadioButton, RadioButtonGroup} from 'material-ui';
import {
    DepositFlag,
    GeneratedFlag,
    PendingReviewFlag,
    RecurrentFlag,
} from 'components/internal/common/MainScreenFlags';
import {DebounceInput} from 'react-debounce-input';

const PENDING = 'Pending';
const RECURRENT = 'Recurrent';
const GENERATED = 'Generated';
const DEPOSIT = 'Deposit';
const YES = 'yes';
const NO = 'no';
const ONLY = 'only';
const FlagIconMenu = ({icon, filter, name, onChange}) => (
    <IconMenu
        iconButtonElement={
            <IconButton style={{padding: 0, width: 'auto', height: 'auto'}}>
                {icon}
            </IconButton>
        }
        style={{position: 'relative', top: 5}}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
    >
        <div style={{padding: '0 10px'}}>
            Display {name} Transactions
            <RadioButtonGroup
                name={name}
                defaultSelected={
                    (filter && filter.value && filter.value[name]) || YES
                }
                style={{margin: '10px 0 0'}}
                onChange={(event: SyntheticEvent<HTMLInputElement>) =>
                    onChange(name, event.currentTarget.value)
                }
            >
                <RadioButton value={YES} label="Yes" />
                <RadioButton value={NO} label="No" />
                <RadioButton value={ONLY} label="Exclusive" />
            </RadioButtonGroup>
        </div>
    </IconMenu>
);

export const DescriptionFilter = ({onChange, filter}) => {
    const handleChange = (name, value) => {
        const newFilter = {...(filter && filter.value)};

        newFilter[name] = value;

        onChange(newFilter);
    };

    return (
        <div style={{textAlign: 'left', display: 'flex', flexDirection: 'row'}}>
            <FlagIconMenu
                onChange={handleChange}
                name={DEPOSIT}
                filter={filter}
                icon={<DepositFlag />}
            />
            <FlagIconMenu
                onChange={handleChange}
                name={PENDING}
                filter={filter}
                icon={<PendingReviewFlag />}
            />
            <FlagIconMenu
                onChange={handleChange}
                name={RECURRENT}
                filter={filter}
                icon={<RecurrentFlag />}
            />
            <FlagIconMenu
                onChange={handleChange}
                name={GENERATED}
                filter={filter}
                icon={<GeneratedFlag />}
            />
            <DebounceInput
                placeholder="Type to search..."
                type="search"
                value={(filter && filter.value && filter.value.text) || ''}
                style={{
                    flex: 1,
                    marginLeft: 5,
                }}
                debounceTimeout={300}
                onChange={(event) => handleChange('text', event.target.value)}
            />
        </div>
    );
};
