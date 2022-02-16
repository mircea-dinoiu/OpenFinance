import {styled} from '@material-ui/core/styles';

export const EndDatePickerMenuGrid = styled('div')((props) => ({
    display: 'grid',
    gridAutoFlow: 'column',
}));

export const ShiftMenu = styled('div')((props) => ({
    display: 'grid',
    gridAutoFlow: 'column',
    padding: props.theme.spacing(2, 0),
}));

export const ShiftMenuToday = styled('div')((props) => ({
    padding: props.theme.spacing(1, 1, 0),
}));
