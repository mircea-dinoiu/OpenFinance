import * as React from 'react';
import {SyntheticEvent} from 'react';
import {IconButton, IconMenu, RadioButton, RadioButtonGroup} from 'material-ui';
import IconFilterList from '@material-ui/icons/FilterList';
import {DebounceInput} from 'react-debounce-input';
import {gridGap, spacingLarge} from 'defs/styles';
import styled from 'styled-components';

const PENDING = 'Pending';
const RECURRENT = 'Recurrent';
const GENERATED = 'Generated';
const DEPOSIT = 'Deposit';
const YES = 'yes';
const NO = 'no';
const ONLY = 'only';
const Subfilter = ({filter, name, onChange}) => (
    <div>
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
);

const SubfilterGrid = styled.div`
    display: grid;
    grid-gap: ${gridGap};
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 0 ${spacingLarge};
`;

export const DescriptionFilter = ({onChange, filter}) => {
    const handleChange = (name, value) => {
        const newFilter = {...(filter && filter.value)};

        newFilter[name] = value;

        onChange(newFilter);
    };

    return (
        <div style={{textAlign: 'left', display: 'flex', flexDirection: 'row'}}>
            <IconMenu
                iconButtonElement={
                    <IconButton
                        style={{padding: 0, width: 'auto', height: 'auto'}}
                    >
                        <IconFilterList />
                    </IconButton>
                }
                style={{position: 'relative', top: 5}}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
            >
                <SubfilterGrid>
                    <Subfilter
                        onChange={handleChange}
                        name={DEPOSIT}
                        filter={filter}
                    />
                    <Subfilter
                        onChange={handleChange}
                        name={PENDING}
                        filter={filter}
                    />
                    <Subfilter
                        onChange={handleChange}
                        name={RECURRENT}
                        filter={filter}
                    />
                    <Subfilter
                        onChange={handleChange}
                        name={GENERATED}
                        filter={filter}
                    />
                </SubfilterGrid>
            </IconMenu>

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
