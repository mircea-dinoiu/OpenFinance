import {Button, FormControlLabel, Menu, Radio, RadioGroup, withStyles, TextField} from '@material-ui/core';
import {MuiReactSelect} from 'components/dropdowns';
import {spacingNormal, spacingSmall} from 'defs/styles';
import * as React from 'react';
import {Filter} from 'react-table-6';
import {Autocomplete} from '@material-ui/lab';

const styles = {
    paper: {
        overflow: 'visible',
    },
};

type Mode = 'any' | 'one-of' | 'all' | 'exclude';

export type SelectFilterProps = {
    items: Array<{id: number}>;
    nameKey: string;
    filter: Filter;
    onChange: (value: any) => void;
    classes: any;
    multi?: boolean;
    allowNone?: boolean;
};

class SelectFilterWrapped extends React.PureComponent<
    SelectFilterProps,
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
                    const found = selectOptions.find((option) => option.id === filter.value);

                    return found && found[this.props.nameKey];
                }

                return filter.value
                    .map((id: number) => {
                        const found = selectOptions.find((option) => option.id === id);

                        return found && found[this.props.nameKey];
                    })
                    .join(', ');
            }
        }
    }

    triggerChange(value: 'any' | {mode: Mode; value: string}) {
        if (value === 'any') {
            this.props.onChange(undefined);
        } else {
            this.props.onChange(value);
        }
    }

    handleChangeSelect = (mode: Mode) => (value: string) => {
        // @ts-ignore
        this.setState({[mode]: value});

        if (this.state.radioValue === mode) {
            if (value && ((Array.isArray(value) && value.length) || !Array.isArray(value))) {
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

    getSelectValue(name: string) {
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

    renderRadio({value, label}: {value: string; label: string}) {
        return (
            <FormControlLabel
                style={{margin: 0}}
                value={value}
                control={<Radio style={{padding: 0}} />}
                label={label}
            />
        );
    }

    renderSelect(name: Mode) {
        const options = this.props.items.map((item) => ({
            value: item.id,
            label: item[this.props.nameKey],
            ...item,
        }));
        const value = this.getSelectValue(name);

        const onOpen = () => {
            this.setState({radioValue: name});
        };
        const handleChange = this.handleChangeSelect(name);

        if (this.props.multi) {
            return (
                // @ts-ignore
                <MuiReactSelect
                    isMulti={true}
                    value={options.filter((o) => value.includes(o.value))}
                    onOpen={onOpen}
                    options={options}
                    // @ts-ignore
                    onChange={(values: Array<{value: string}>) =>
                        // @ts-ignore
                        handleChange(values.map((v) => v.value))
                    }
                />
            );
        }

        return (
            <Autocomplete<typeof options[0]>
                value={options.find((o) => value === o.value)}
                onOpen={onOpen}
                getOptionLabel={(o) => o.label}
                options={options}
                disableClearable={true}
                onChange={(e: unknown, o: typeof options[0] | null) => handleChange(o?.value as any)}
                renderInput={(params) => <TextField {...params} InputLabelProps={{shrink: true}} />}
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
                        textTransform: 'none',
                        minHeight: '28px',
                        padding: '0 5px',
                        lineHeight: 1,
                        width: '100%',
                    }}
                    variant="outlined"
                    onClick={(event) => {
                        this.setState({anchorEl: event.currentTarget});
                    }}
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
                            padding: `${spacingSmall} ${spacingNormal}`,
                            width: 200,
                        }}
                    >
                        <RadioGroup
                            value={this.state.radioValue}
                            onChange={(event) => {
                                const radioValue = event.target.value as Mode;

                                if (['one-of', 'all', 'exclude'].includes(radioValue)) {
                                    if (this.state[radioValue]) {
                                        this.triggerChange({
                                            mode: radioValue,
                                            value: this.state[radioValue],
                                        });
                                    }
                                } else {
                                    // @ts-ignore
                                    this.triggerChange(radioValue);
                                }
                                this.setState({radioValue});
                            }}
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
