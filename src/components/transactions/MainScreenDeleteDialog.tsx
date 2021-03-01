import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {ClassNameMap} from '@material-ui/core/styles/withStyles';
import {dialog} from 'defs/styles';
import * as React from 'react';

const MainScreenDeleteDialogWrapped = ({
    open,
    entityName,
    onYes,
    onNo,
    count = 1,
    classes,
    ...props
}: {
    open: boolean;
    entityName: string;
    onYes: () => void;
    onNo: () => void;
    count?: number;
    classes: ClassNameMap;
}) => (
    <Dialog open={open} classes={classes} {...props}>
        <DialogTitle>{`Delete ${entityName}${count === 1 ? '' : 's'}?`}</DialogTitle>
        <DialogContent>
            Are you sure you want to delete {count === 1 ? 'this' : 'these'} {entityName}
            {count !== 1 && 's'}?
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={onYes} style={{marginRight: 5}}>
                Yes
            </Button>
            <Button variant="contained" color="primary" onClick={onNo}>
                No
            </Button>
        </DialogActions>
    </Dialog>
);

export const MainScreenDeleteDialog = withStyles(dialog)(MainScreenDeleteDialogWrapped);
