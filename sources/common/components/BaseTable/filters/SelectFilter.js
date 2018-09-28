// @flow
import React from 'react';
import {
    Button,
    Menu,
    Radio,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    withStyles,
} from '@material-ui/core';
import { MultiSelect, SingleSelect } from 'common/components/Select';

const styles = {
    paper: {
        overflow: 'visible',
    },
};

type TypeProps = {
    items: Array<{ id: number }>,
    nameKey: string,
    filter: ?{ value: any },
    onChange: (value: any) => void,
    classes: any,
    multi?: boolean,
    allowNone?: boolean,
};

class SelectFilter extends React.PureComponent<TypeProps> {
    state = {
        anchorEl: null,
        radioValue: this.getRadioDefaulValue(),
    };

    static defaultProps = {
        nameKey: 'name',
        multi: false,
        allowNone: true,
    };

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
            radioValue: this.getRadioDefaulValue(),
        });
    };

    renderText() {
        const value = this.getFilterValue();

        switch (value) {
            case 'none':
                return 'None';
            case 'any':
                return 'Any';
            default: {
                const selectOptions = this.props.items;

                if (!this.props.multi) {
                    return selectOptions.find((option) => option.id === value)[
                        this.props.nameKey
                    ];
                }

                return value
                    .map(
                        (id) =>
                            selectOptions.find((option) => option.id === id)[
                                this.props.nameKey
                            ],
                    )
                    .join(', ');
            }
        }
    }

    triggerChange(value) {
        if (value === 'any') {
            this.props.onChange(undefined);
        } else {
            this.props.onChange(value);
        }
    }

    handleChangeRadio = (event) => {
        const radioValue = event.target.value;

        if (radioValue !== 'custom') {
            this.triggerChange(radioValue);
        }

        this.setState({ radioValue });
    };

    handleChangeSelect = (arg) => {
        if (arg) {
            this.triggerChange(
                this.props.multi ? arg.split(',').map(Number) : arg,
            );
        } else {
            this.triggerChange('any');
        }
    };

    getFilterValue() {
        const { filter } = this.props;

        return (filter && filter.value) || 'any';
    }

    getSelectValue() {
        const filterValue = this.getFilterValue();

        if (this.props.multi) {
            if (Array.isArray(filterValue)) {
                return filterValue;
            }

            return [];
        }

        return filterValue;
    }

    getRadioDefaulValue() {
        const filterValue = this.getFilterValue();

        if (filterValue !== 'any' && filterValue !== 'none') {
            return 'custom';
        }

        return filterValue;
    }

    getRadioOptions() {
        return [
            ['any', 'Any'],
            this.props.allowNone ? ['none', 'None'] : null,
            ['custom', 'Custom'],
        ].filter(Boolean);
    }

    render() {
        const { anchorEl } = this.state;
        const Select = this.props.multi ? MultiSelect : SingleSelect;

        return (
            <>
                <Button
                    size="small"
                    style={{
                        background: 'white',
                        textTransform: 'none',
                        minHeight: '28px',
                        padding: '0 5px',
                        lineHeight: 1,
                        width: '100%',
                    }}
                    variant="outlined"
                    onClick={this.handleClick}
                >
                    {this.renderText()}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    classes={this.props.classes}
                >
                    <div style={{ padding: '5px 10px', width: 200 }}>
                        <FormLabel component="legend">Categories</FormLabel>
                        <RadioGroup
                            value={this.state.radioValue}
                            onChange={this.handleChangeRadio}
                        >
                            {this.getRadioOptions().map(([value, label]) => (
                                <FormControlLabel
                                    key={value}
                                    style={{ margin: 0 }}
                                    value={value}
                                    control={<Radio style={{ padding: 0 }} />}
                                    label={label}
                                />
                            ))}
                            <Select
                                value={this.getSelectValue()}
                                onOpen={() => {
                                    this.setState({ radioValue: 'custom' });
                                }}
                                options={this.props.items.map((item) => ({
                                    value: item.id,
                                    label: item[this.props.nameKey],
                                }))}
                                onChange={this.handleChangeSelect}
                            />
                        </RadioGroup>
                    </div>
                </Menu>
            </>
        );
    }
}

export default withStyles(styles)(SelectFilter);
