import {makeStyles} from '@material-ui/core/styles';

export const headerColor = 'rgba(255, 255, 255, 0.9)';

export const useCardHeaderStyles = makeStyles({
    root: {
        color: headerColor,
        cursor: 'pointer',
    },
    title: {
        fontSize: 'medium',
    },
    subheader: {
        fontSize: 'small',
    },
    action: {
        margin: 0,
    },
});
