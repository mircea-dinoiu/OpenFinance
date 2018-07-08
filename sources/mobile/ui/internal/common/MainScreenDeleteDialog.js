import React from 'react';

import { Dialog, RaisedButton } from 'material-ui';

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
            <RaisedButton
                label="Yes"
                primary={false}
                onClick={onYes}
                onTouchTap={onYes}
                style={{ marginRight: 5 }}
            />
            <RaisedButton
                label="No"
                primary={true}
                onClick={onNo}
                onTouchTap={onNo}
            />
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
