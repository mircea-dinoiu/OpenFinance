import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';

export const BigLoader = () => (
    <div style={{textAlign: 'center', padding: '50px 0 50px'}}>
        <CircularProgress size={100} thickness={2} />
    </div>
);

export const ButtonProgress = () => <CircularProgress size={20} />;
