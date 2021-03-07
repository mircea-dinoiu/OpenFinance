import {styled} from '@material-ui/core/styles';

export const ShiftMenu = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    '& legend': {
        margin: '0 auto',
    },
});
