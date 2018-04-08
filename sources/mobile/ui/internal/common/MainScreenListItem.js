import React, {PureComponent} from 'react';

import MoreVertIcon from 'material-ui-icons/MoreVert';
import DeleteIcon from 'material-ui-icons/Delete';
import CreateIcon from 'material-ui-icons/Create';

import {cyan50, red50} from 'material-ui/styles/colors';
import {IconButton, MenuItem, IconMenu, TableRow} from 'material-ui';

import MainScreenDeleteDialog from './MainScreenDeleteDialog';
import MainScreenEditDialog from './MainScreenEditDialog';
import ResponsiveListItem from 'common/components/ResponsiveListItem';
import {connect} from 'react-redux';
import {formatYMD} from 'common/utils/dates';
import moment from 'moment';

class ExpenseListItem extends PureComponent {
    props: {
        entityName: string,
        editDialogProps: {},
        contentComponent: any
    };

    state = {
        expanded: false,
        deleted: false,

        createEditDialog: false,
        editDialogOpen: false,
        editDialogKey: Date.now(),

        deleteDialogOpen: false,
        createDeleteDialog: false
    };

    toggleDetails = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    toggleDeleteDialog = () => {
        this.setState({
            createDeleteDialog: true,
            deleteDialogOpen: !this.state.deleteDialogOpen
        });
    };

    toggleEditDialog = () => {
        this.setState({
            createEditDialog: true,
            editDialogKey: Date.now(),
            editDialogOpen: !this.state.editDialogOpen
        });
    };

    submitDelete = () => {
        this.setState({
            deleted: true
        });

        this.toggleDeleteDialog();
        this.props.onDelete(this.props.item.id);
    };

    submitUpdate = (data) => {
        this.toggleEditDialog();
        this.props.onUpdate(data);
    };

    getStyle() {
        if (this.state.deleted) {
            return {
                backgroundColor: red50,
                textAlign: 'center'
            };
        }

        if (this.state.expanded) {
            return {
                backgroundColor: cyan50
            };
        }

        return {};
    }

    getInnerDivStyle() {
        if (this.state.deleted) {
            return {};
        }

        return {paddingLeft: 40};
    }

    getClassName(): string {
        const classes = [];
        const day = formatYMD;
        const item = this.props.item;

        if (moment(item.created_at).date() % 2 === 0) {
            classes.push('msl__even-row');
        } else {
            classes.push('msl__odd-row');
        }

        if (day(item.created_at) === day(new Date())) {
            classes.push('msl__today-row');
        } else if (day(item.created_at) > day(new Date())) {
            classes.push('msl__future-row');
        }

        return classes.join(' ');
    }

    render() {
        const item = this.props.item;
        const persist = item.persist !== false;

        const ListItemContent = this.props.contentComponent;
        const itemContent = (
            <ListItemContent
                item={item}
                expanded={this.state.expanded}
                data={this.props.data}
            />
        );
        const dialogs = (
            <React.Fragment>
                {this.state.createDeleteDialog && (
                    <MainScreenDeleteDialog
                        open={this.state.deleteDialogOpen}
                        onYes={this.submitDelete}
                        onNo={this.toggleDeleteDialog}
                        entityName={this.props.entityName}
                    />
                )}
                {this.state.createEditDialog && (
                    <MainScreenEditDialog
                        key={this.editDialogKey}
                        open={this.state.editDialogOpen}
                        data={this.props.data}
                        entity={item}
                        onCancel={this.toggleEditDialog}
                        onSave={this.submitUpdate}
                        entityName={this.props.entityName}
                        api={this.props.api}
                        {...this.props.editDialogProps}
                    />
                )}
            </React.Fragment>
        );
        const menuItems = (
            <React.Fragment>
                <MenuItem
                    primaryText="Edit"
                    leftIcon={<CreateIcon />}
                    onTouchTap={this.toggleEditDialog}
                />
                <MenuItem
                    primaryText="Delete"
                    leftIcon={<DeleteIcon />}
                    onTouchTap={this.toggleDeleteDialog}
                />
            </React.Fragment>
        );

        if (this.props.screen.isLarge) {
            return (
                <TableRow
                    style={this.getStyle()}
                    className={this.getClassName()}
                    hoverable={true}
                    onDoubleClick={this.toggleEditDialog}
                >
                    {dialogs}
                    {itemContent}
                </TableRow>
            );
        }

        return this.state.deleted ? (
            <ResponsiveListItem
                style={this.getStyle()}
                innerDivStyle={this.getInnerDivStyle()}
            >
                Deleted: <strong>{item[this.props.nameProperty]}</strong>
            </ResponsiveListItem>
        ) : (
            <ResponsiveListItem
                onTouchTap={this.toggleDetails}
                style={this.getStyle()}
                innerDivStyle={this.getInnerDivStyle()}
                leftIcon={
                    persist ? (
                        <IconMenu
                            iconButtonElement={
                                <IconButton style={{padding: 0, width: 40}}>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            anchorOrigin={{
                                horizontal: 'left',
                                vertical: 'top'
                            }}
                            targetOrigin={{
                                horizontal: 'left',
                                vertical: 'top'
                            }}
                            style={{marginLeft: 0, left: 0}}
                            onTouchTap={(event) => event.stopPropagation()}
                        >
                            {menuItems}
                        </IconMenu>
                    ) : null
                }
            >
                {dialogs}
                {itemContent}
            </ResponsiveListItem>
        );
    }
}

export default connect(({screen}) => ({screen}))(ExpenseListItem);
