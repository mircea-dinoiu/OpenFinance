import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export const BigLoader = (props) => (
    <div style={{ textAlign: 'center', padding: '50px 0 50px' }}>
        <CircularProgress size={100} {...props} />
    </div>
);

export const ButtonProgress = (props) => (
    <CircularProgress
        size={20}
        {...props}
    />
);
