import {styled, Theme} from '@material-ui/core';

export const CategoryFilterLabelText = styled('span')((props: {indicatorColor?: string; theme: Theme}) => ({
    display: 'flex',
    alignItems: 'center',
    gap: props.theme.spacing(1),
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        height: '2px',
        width: '100%',
        backgroundColor: props.indicatorColor ?? 'transparent',
        bottom: 0,
        left: 0,
    },
}));
