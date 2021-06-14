import {styled} from '@material-ui/core/styles';

export const ShiftMenu = styled('div')((props) => ({
    display: 'grid',
    gridAutoFlow: 'column',
    '& legend': {
        margin: '0 auto',
    },
}));

export const ShiftMenuToday = styled('div')((props) => ({
    padding: props.theme.spacing(1, 1, 0),
}));
