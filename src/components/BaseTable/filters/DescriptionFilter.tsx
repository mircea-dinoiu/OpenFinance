import * as React from 'react';
import {SyntheticEvent} from 'react';
import IconFilterList from '@material-ui/icons/FilterList';
import {DebounceInput} from 'react-debounce-input';
import {gridGap, spacingLarge} from 'defs/styles';
import styled from 'styled-components';
import {
    Menu,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@material-ui/core';

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
        <RadioGroup
            name={name}
            value={(filter && filter.value && filter.value[name]) || YES}
            style={{margin: '10px 0 0'}}
            onChange={(event: SyntheticEvent<HTMLInputElement>) =>
                onChange(name, event.currentTarget.value)
            }
        >
            <FormControlLabel value={YES} label="Yes" control={<Radio />} />
            <FormControlLabel value={NO} label="No" control={<Radio />} />
            <FormControlLabel
                value={ONLY}
                label="Exclusive"
                control={<Radio />}
            />
        </RadioGroup>
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
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{textAlign: 'left', display: 'flex', flexDirection: 'row'}}>
            <IconButton
                style={{padding: 0, width: 'auto', height: 'auto'}}
                onClick={handleClick}
            >
                <IconFilterList />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
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
            </Menu>

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
