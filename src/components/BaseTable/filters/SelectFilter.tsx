import * as React from 'react';
import {Button, FormControlLabel, Menu, Radio, RadioGroup, withStyles} from '@material-ui/core';
import {MultiSelect, SingleSelect} from 'components/Select';
import {spacingMedium, spacingSmall} from 'defs/styles';

const styles = {
    paper: {
        overflow: 'visible',
    },
};

type TypeProps = {
    items: Array<{id: number}>;
    nameKey: string;
    filter: {value: any} | null | void;
    onChange: (value: any) => void;
    classes: any;
    multi?: boolean;
    allowNone?: boolean;
};

class SelectFilterWrapped extends React.PureComponent<
    TypeProps,
    {
        anchorEl: HTMLElement | null;
        radioValue: string;
    }
> {
    state = {
        anchorEl: null,
        radioValue: this.getRadioDefaultValue(),
    };

    static defaultProps = {
        nameKey: 'name',
        multi: false,
        allowNone: true,
    };

    handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
            radioValue: this.getRadioDefaultValue(),
        });
    };

    renderText() {
        const filter = this.getFilterValue();

        switch (filter) {
            case 'none':
                return 'None';
            case 'any':
                return 'Any';
            default: {
                const selectOptions = this.props.items;

                if (!this.props.multi) {
                    const found = selectOptions.find(
                        (option) => option.id === filter.value,
                    );

                    return found && found[this.props.nameKey];
                }

                return filter.value
                    .map((id) => {
                        const found = selectOptions.find(
                            (option) => option.id === id,
                        );

                        return found && found[this.props.nameKey];
                    })
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

        if (['one-of', 'all', 'exclude'].includes(radioValue)) {
            if (this.state[radioValue]) {
                this.triggerChange({
                    mode: radioValue,
                    value: this.state[radioValue],
                });
            }
        } else {
            this.triggerChange(radioValue);
        }
        this.setState({radioValue});
    };

    handleChangeSelect = (mode) => (value) => {
        // @ts-ignore
        this.setState({[mode]: value});

        if (this.state.radioValue === mode) {
            if (
                value &&
                ((Array.isArray(value) && value.length) ||
                    !Array.isArray(value))
            ) {
                this.triggerChange({mode, value});
            } else {
                this.triggerChange('any');
            }
        }
    };

    getFilterValue() {
        const {filter} = this.props;

        return (filter && filter.value) || 'any';
    }

    getSelectValue(name) {
        const filterValue = this.state[name];

        if (this.props.multi) {
            if (Array.isArray(filterValue)) {
                return filterValue;
            }

            return [];
        }

        return filterValue;
    }

    getRadioDefaultValue() {
        const filterValue = this.getFilterValue();

        if (filterValue !== 'any' && filterValue !== 'none') {
            return filterValue.mode;
        }

        return filterValue;
    }

    renderRadio({value, label}) {
        return (
            <FormControlLabel
                style={{margin: 0}}
                value={value}
                control={<Radio style={{padding: 0}} />}
                label={label}
            />
        );
    }

    renderSelect(name) {
        const Select = this.props.multi ? MultiSelect : SingleSelect;

        return (
            <Select
                value={this.getSelectValue(name)}
                onOpen={() => {
                    this.setState({radioValue: name});
                }}
                options={this.props.items.map((item) => ({
                    value: item.id,
                    label: item[this.props.nameKey],
                }))}
                onChange={this.handleChangeSelect(name)}
            />
        );
    }

    render() {
        const {anchorEl} = this.state;

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
                    <div
                        style={{
                            padding: `${spacingSmall} ${spacingMedium}`,
                            width: 200,
                        }}
                    >
                        <RadioGroup
                            value={this.state.radioValue}
                            onChange={this.handleChangeRadio}
                        >
                            {this.renderRadio({value: 'any', label: 'Any'})}

                            {this.props.allowNone &&
                                this.renderRadio({
                                    value: 'none',
                                    label: 'None',
                                })}
                            {this.renderRadio({
                                value: 'one-of',
                                label: 'One of',
                            })}
                            {this.renderSelect('one-of')}

                            {this.props.multi &&
                                this.renderRadio({
                                    value: 'all',
                                    label: 'All',
                                })}
                            {this.props.multi && this.renderSelect('all')}

                            {this.renderRadio({
                                value: 'exclude',
                                label: 'Exclude',
                            })}
                            {this.renderSelect('exclude')}
                        </RadioGroup>
                    </div>
                </Menu>
            </>
        );
    }
}

export const SelectFilter = withStyles(styles)(SelectFilterWrapped);
