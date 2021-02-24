import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {emphasize} from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import clsx from 'clsx';
import * as React from 'react';
import Select from 'react-select';

const styles = (theme: any) => ({
    root: {
        flexGrow: 1,
    },
    input: {
        display: 'flex',
        padding: 0,
        height: 'auto',
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    chip: {
        margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: theme.spacing(1, 2),
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        bottom: 6,
    },
    paper: {
        position: 'absolute',
        zIndex: 2,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing(2),
    },
});

const NoOptionsMessage = (props: any) => (
    <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
        {props.children}
    </Typography>
);

const inputComponent = ({inputRef, ...props}: any) => <div ref={inputRef} {...props} />;

const Control = (props: any) => (
    <TextField
        fullWidth
        InputProps={{
            inputComponent,
            inputProps: {
                className: props.selectProps.classes.input,
                ref: props.innerRef,
                children: props.children,
                ...props.innerProps,
            },
        }}
        {...props.selectProps.TextFieldProps}
    />
);

const Option = (props: any) => (
    <MenuItem
        ref={props.innerRef}
        selected={props.isFocused}
        component="div"
        style={{
            fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
    >
        {props.children}
    </MenuItem>
);

const Placeholder = (props: any) => (
    <Typography color="textSecondary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
        {props.children}
    </Typography>
);

const SingleValue = (props: any) => (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
        {props.children}
    </Typography>
);

const ValueContainer = (props: any) => <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;

const MultiValue = (props: any) => (
    <Chip
        tabIndex={-1}
        label={props.children}
        className={clsx(props.selectProps.classes.chip, {
            [props.selectProps.classes.chipFocused]: props.isFocused,
        })}
        onDelete={props.removeProps.onClick}
        deleteIcon={<CancelIcon {...props.removeProps} />}
    />
);

const Menu = (props: any) => (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
        {props.children}
    </Paper>
);

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

const selectStyles = (theme: any) => ({
    input: (base: any) => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
            font: 'inherit',
        },
    }),
});

const addMaterialStyles = (Component: typeof Select) =>
    // @ts-ignore
    withStyles(styles, {withTheme: true})(
        // @ts-ignore
        <O,>({classes, theme, label, ...props}) => (
            <div className={classes.root}>
                <Component<O>
                    classes={classes}
                    placeholder={label}
                    styles={selectStyles(theme)}
                    TextFieldProps={{
                        label,
                        InputLabelProps: {
                            shrink: true,
                        },
                    }}
                    components={components}
                    {...props}
                />
            </div>
        ),
    );

export const MuiReactSelect: typeof Select = addMaterialStyles(Select);
