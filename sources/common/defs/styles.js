import transitions from 'material-ui/styles/transitions';

export const flexColumn = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
};

export const greyedOut = {
    filter: 'grayscale(100%)',
    transition: transitions.easeOut('5000ms', 'all'),
    opacity: '0.5',
};

export const overflowVisible = {
    overflow: 'visible',
};

export const smallAvatar = { marginLeft: 5, height: 20, width: 20, display: 'inline-block' };

export const dialog = {
    root: {
        padding: 10,
    },
    paper: {
        margin: '0 auto !important',
        overflow: 'visible',
    },
};
