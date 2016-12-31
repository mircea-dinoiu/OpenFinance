import React from 'react';
import {CircularProgress} from 'material-ui';

const ButtonProgress = (props) => {
    return <CircularProgress size={25} {...props} style={{margin: '5px 0 0', ...props.style}}/>
};

export default ButtonProgress;