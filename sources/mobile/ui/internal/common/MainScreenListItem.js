import React, {PureComponent} from 'react';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import CreateIcon from 'material-ui/svg-icons/content/create';

import {cyan50, red50} from 'material-ui/styles/colors';
import {IconButton, MenuItem, IconMenu} from 'material-ui';
import {ListItem} from 'material-ui/List';


import MainScreenDeleteDialog from './MainScreenDeleteDialog';
import MainScreenEditDialog from './MainScreenEditDialog';

export default class ExpenseListItem extends PureComponent {
    props: {
        entityName: string,
        editDialogProps: {

        },
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

    render() {
        const item = this.props.item;

        const ListItemContent = this.props.contentComponent;

        return (
            this.state.deleted ? (
                    <ListItem style={this.getStyle()}>
                        Deleted: <strong>{item[this.props.nameProperty]}</strong>
                    </ListItem>
                ) : (
                    <ListItem onTouchTap={this.toggleDetails}
                              style={this.getStyle()}
                              innerDivStyle={{paddingLeft: 40}}
                              leftIcon={(
                        <IconMenu
                          iconButtonElement={<IconButton style={{padding: 0, width: 40}}><MoreVertIcon /></IconButton>}
                          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                          targetOrigin={{horizontal: 'left', vertical: 'top'}}
                          style={{marginLeft: 0, left: 0}}
                          onTouchTap={event => event.stopPropagation()}
                        >
                          <MenuItem primaryText="Edit" leftIcon={<CreateIcon/>} onTouchTap={this.toggleEditDialog}/>
                          <MenuItem primaryText="Delete" leftIcon={<DeleteIcon/>} onTouchTap={this.toggleDeleteDialog}/>
                        </IconMenu>
                      )}
                    >
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
                        <ListItemContent
                            item={item}
                            expanded={this.state.expanded}
                            data={this.props.data}
                        />
                    </ListItem>
                )
        );
    }
}