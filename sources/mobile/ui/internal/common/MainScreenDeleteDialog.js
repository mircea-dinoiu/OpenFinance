import React from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    paper: {
        margin: '0 10px',
    },
};
const MainScreenDeleteDialog = ({
    open,
    entityName,
    onYes,
    onNo,
    count = 1,
    classes,
    ...props
}) => (
    <Dialog open={open} classes={classes} {...props}>
        <DialogTitle>
            {`Delete ${entityName}${count === 1 ? '' : 's'}?`}
        </DialogTitle>
        <DialogContent>
            Are you sure you want to delete {count === 1 ? 'this' : 'these'}{' '}
            {entityName}
            {count !== 1 && 's'}?
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
    </Dialog>
);

export default withStyles(styles)(MainScreenDeleteDialog);
