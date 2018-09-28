// @flow
import React from 'react';
import {
    Button,
    Menu,
    Radio,
    FormLabel,
    RadioGroup,
    FormControlLabel,
} from '@material-ui/core';
import { MultiSelect } from 'common/components/Select';
import { connect } from 'react-redux';

class CategoriesMenu extends React.PureComponent {
    state = {
        anchorEl: null,
        radioValue: this.getDefaultRadioValue(),
    };

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    renderText() {
        const value = this.getFilterValue();

        switch (value) {
            case 'none':
                return 'None';
            case 'any':
                return 'Any';
            default: {
                const selectOptions = this.getSelectOptions();

                return value
                    .map(
                        (id) =>
                            selectOptions.find((option) => option.id === id).name,
                    )
                    .join(', ');
            }
        }
    }

    handleChangeRadio = (event) => {
        const radioValue = event.target.value;

        if (radioValue !== 'custom') {
            this.props.onChange(radioValue);
        }

        this.setState({ radioValue });
    };

    handleChangeSelect = (arg) => {
        if (arg) {
            this.props.onChange(arg.split(',').map(Number));
        } else {
            this.props.onChange('any');
        }
    };

    getFilterValue() {
        const { filter } = this.props;

        return (filter && filter.value) || 'any';
    }

    getSelectValue() {
        const filterValue = this.getFilterValue();

        if (Array.isArray(filterValue)) {
            return filterValue;
        }

        return [];
    }

    getDefaultRadioValue() {
        const filterValue = this.getFilterValue();

        if (Array.isArray(filterValue)) {
            return 'custom';
        }

        return filterValue;
    }

    getSelectOptions() {
        return this.props.categories.toJS();
    }

    render() {
        const { anchorEl } = this.state;

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
                >
                    <div
                        style={{ padding: '5px 10px', width: 200, height: 350 }}
                    >
                        <FormLabel component="legend">Categories</FormLabel>
                        <RadioGroup
                            value={this.state.radioValue}
                            onChange={this.handleChangeRadio}
                        >
                            {[
                                ['any', 'Any'],
                                ['none', 'None'],
                                ['custom', 'Custom'],
                            ].map(([value, label]) => (
                                <FormControlLabel
                                    key={value}
                                    style={{ margin: 0 }}
                                    value={value}
                                    control={<Radio style={{ padding: 0 }} />}
                                    label={label}
                                />
                            ))}
                            <MultiSelect
                                disabled={this.state.radioValue !== 'custom'}
                                value={this.getSelectValue()}
                                options={this.getSelectOptions().map(
                                    (category) => ({
                                        value: category.id,
                                        label: category.name,
                                    }),
                                )}
                                onChange={this.handleChangeSelect}
                            />
                        </RadioGroup>
                    </div>
                </Menu>
            </>
        );
    }
}

const mapStateToProps = ({ categories }) => ({ categories });
const ConnectedCategoriesMenu = connect(mapStateToProps)(CategoriesMenu);

const CategoriesFilter = ({ categories, onChange, filter }) => (
    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'row' }}>
        <ConnectedCategoriesMenu
            onChange={onChange}
            categories={categories}
            filter={filter}
        />
    </div>
);

export default CategoriesFilter;
