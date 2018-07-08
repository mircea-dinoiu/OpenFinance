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
