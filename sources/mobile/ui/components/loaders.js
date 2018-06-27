import React from 'react';
import {CircularProgress} from 'material-ui';

export const BigLoader = (props) => (
    <div style={{textAlign: 'center', padding: '50px 0 50px'}}>
        <CircularProgress size={100} {...props} />
    </div>
);

export const ButtonProgress = (props) => (
    <CircularProgress
        size={25}
        {...props}
        style={{margin: '5px 0 0', ...props.style}}
    />
);
