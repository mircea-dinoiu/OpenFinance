// @flow
import React from 'react';
import {
    IconMenu,
    IconButton,
    RadioButtonGroup,
    RadioButton,
} from 'material-ui';
import {
    PendingReviewFlag,
    RecurrentFlag,
    GeneratedFlag,
} from 'mobile/ui/internal/common/MainScreenFlags';
import { DebounceInput } from 'react-debounce-input';

const PENDING = 'Pending';
const RECURRENT = 'Recurrent';
const GENERATED = 'Generated';
const YES = 'yes';
const NO = 'no';
const ONLY = 'only';
const FlagIconMenu = ({ icon, filter, name, onChange }) => (
    <IconMenu
        iconButtonElement={
            <IconButton style={{ padding: 0, width: 'auto', height: 'auto' }}>
                {icon}
            </IconButton>
        }
        style={{ position: 'relative', top: 5 }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
    >
        <div style={{ padding: '0 10px' }}>
            Display {name}
            <RadioButtonGroup
                name={name}
                defaultSelected={
                    (filter && filter.value && filter.value[name]) || YES
                }
                style={{ margin: '10px 0 0' }}
                onChange={(event) => onChange(name, event.target.value)}
            >
                <RadioButton value={YES} label="Yes" />
                <RadioButton value={NO} label="No" />
                <RadioButton value={ONLY} label="Only" />
            </RadioButtonGroup>
        </div>
    </IconMenu>
);
const DescriptionFilter = ({ onChange, filter }) => {
    const handleChange = (name, value) => {
        const newFilter = { ...(filter && filter.value) };

        newFilter[name] = value;

        onChange(newFilter);
    };

    return (
        <div
            style={{ textAlign: 'left', display: 'flex', flexDirection: 'row' }}
        >
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

export default DescriptionFilter;
