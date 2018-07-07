import React from 'react';

import { Dialog, RaisedButton } from 'material-ui';

const MainScreenDeleteDialog = ({
    open,
    entityName,
    onYes,
    onNo,
    ...props
}) => {
    const actions = (
        <React.Fragment>
            <RaisedButton
                label="Yes"
                primary={false}
                onTouchTap={onYes}
                style={{ marginRight: 5 }}
            />,
            <RaisedButton label="No" primary={true} onTouchTap={onNo} />
        </React.Fragment>
    );

    return (
        <Dialog
            title={`Delete ${entityName}?`}
            open={open}
            actions={actions}
            {...props}
        >
            Are you sure you want to delete this {entityName}?
        </Dialog>
    );
};

export default MainScreenDeleteDialog;
