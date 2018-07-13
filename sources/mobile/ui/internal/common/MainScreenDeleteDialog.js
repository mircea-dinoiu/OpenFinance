import React from 'react';

import { Dialog } from 'material-ui';
import { Button } from '@material-ui/core';

const MainScreenDeleteDialog = ({
    open,
    entityName,
    onYes,
    onNo,
    count = 1,
    ...props
}) => {
    const actions = (
        <React.Fragment>
            <Button
                variant="contained"
                onClick={onYes}
                onTouchTap={onYes}
                style={{ marginRight: 5 }}
            >
                Yes
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={onNo}
                onTouchTap={onNo}
            >
                No
            </Button>
        </React.Fragment>
    );

    return (
        <Dialog
            title={`Delete ${entityName}${count === 1 ? '' : 's'}?`}
            open={open}
            actions={actions}
            {...props}
        >
            Are you sure you want to delete {count === 1 ? 'this' : 'these'}{' '}
            {entityName}
            {count !== 1 && 's'}?
        </Dialog>
    );
};

export default MainScreenDeleteDialog;
