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
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
    >
        <div style={{ padding: '0 10px' }}>
            Display {name}
            <RadioButtonGroup
                name={name}
                defaultSelected={(filter && filter.value && filter.value[name]) || YES}
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
        const newFilter = { ...filter };

        newFilter[name] = value;

        onChange(newFilter);
    };

    return (
        <div style={{ textAlign: 'left' }}>
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
        </div>
    );
};

export const filterMethod = (filter, row) => {
    const item = row._original; // eslint-disable-line
    const value = filter.value || {};

    if (value[PENDING]) {
        switch (value[PENDING]) {
            case NO:
                if (item.status === 'pending') {
                    return false;
                }
                break;
            case ONLY:
                if (item.status !== 'pending') {
                    return false;
                }
                break;
        }
    }

    if (value[RECURRENT]) {
        switch (value[RECURRENT]) {
            case NO:
                if (item.repeat != null) {
                    return false;
                }
                break;
            case ONLY:
                if (item.repeat == null) {
                    return false;
                }
                break;
        }
    }

    if (value[GENERATED]) {
        switch (value[GENERATED]) {
            case NO:
                if (item.persist === false) {
                    return false;
                }
                break;
            case ONLY:
                if (item.persist !== false) {
                    return false;
                }
                break;
        }
    }

    return true;
};

export default DescriptionFilter;
