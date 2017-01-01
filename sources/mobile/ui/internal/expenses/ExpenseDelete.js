import React from 'react';

import {Dialog, RaisedButton} from 'material-ui';

const ExpenseDelete = ({open, onYes, onNo, ...props}) => {
    const actions = [
        <RaisedButton
            label="Yes"
            primary={false}
            onTouchTap={onYes}
            style={{marginRight: 5}}
        />,
        <RaisedButton
            label="No"
            primary={true}
            onTouchTap={onNo}
        />
    ];

    return (
        <Dialog
            title="Delete Expense?"
            open={open}
            actions={actions}
            {...props}
        >
            Are you sure you want to delete this expense?
        </Dialog>
    )
};

export default ExpenseDelete;