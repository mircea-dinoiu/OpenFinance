import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export const BigLoader = () => (
    <div style={{textAlign: 'center', padding: '50px 0 50px'}}>
        <CircularProgress size={100} thickness={2} />
    </div>
);

export const ButtonProgress = () => <CircularProgress size={20} />;

export const LoadingTopBar = () => null;
