import React, {PureComponent} from 'react';
import moment from 'moment';

import {Row, Col} from 'react-grid-system';

import Warning from 'material-ui/svg-icons/alert/warning';
import Cached from 'material-ui/svg-icons/action/cached';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import {cyan50, grey500, grey700, yellowA700, cyan500, red50} from 'material-ui/styles/colors';
import {Avatar, Chip, IconButton, MenuItem, IconMenu, Dialog, RaisedButton} from 'material-ui';
import {ListItem} from 'material-ui/List';

import RepeatOptions from 'common/defs/repeatOptions';

export default class ExpenseListItem extends PureComponent {
    state = {
        expanded: false,
        deleteDialogOpen: false,
        createDeleteDialog: false,
        deleted: false
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

    submitDelete = () => {
        this.setState({
            deleted: true
        });

        this.toggleDeleteDialog();
        this.props.onDelete(this.props.item.id);
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
        const userList = this.props.data.user.get('list');
        const currenciesMap = this.props.data.currencies.get('map');
        const currencyISOCode = currenciesMap.getIn([String(item.currency_id), 'iso_code']);

        return (
            this.state.deleted ? (
                <ListItem style={this.getStyle()}>
                    Deleted: <strong>{item.item}</strong>
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
                          <MenuItem primaryText="Delete" leftIcon={<DeleteIcon/>} onTouchTap={this.toggleDeleteDialog}/>
                        </IconMenu>
                      )}
                >
                    {this.state.createDeleteDialog && (
                        <Dialog
                            title="Delete Expense?"
                            open={this.state.deleteDialogOpen}
                            actions={[
                        <RaisedButton
                            label="Yes"
                            primary={false}
                            onTouchTap={this.submitDelete}
                            style={{marginRight: 5}}
                        />,
                        <RaisedButton
                            label="No"
                            primary={true}
                            onTouchTap={this.toggleDeleteDialog}
                        />
                    ]}
                        >
                            Are you sure you want to delete this expense?
                        </Dialog>
                    )}
                    <Row>
                        <Col xs={6}>{item.item}</Col>
                        <Col xs={6} style={{textAlign: 'right'}}>
                            {userList.map(
                                each => item.users.includes(each.get('id')) ? (
                                    <Avatar key={each.get('id')} src={each.get('avatar')} size={20} style={{marginLeft: 5}}/>
                                ) : null
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                        <span style={{fontSize: 14, float: 'left', lineHeight: '20px'}}>
                            <span style={{color: grey700}}>{currencyISOCode}</span> {new Intl.NumberFormat().format(item.sum)}
                        </span>
                            &nbsp;
                            {item.status === 'pending' && <Warning style={{height: 20, width: 20}} color={yellowA700}/>}
                            {item.repeat != null && <Cached style={{height: 20, width: 20}} color={cyan500}/>}
                        </Col>
                        <Col xs={6} style={{textAlign: 'right'}}>
                            {item.money_location_id && (
                                <span style={{fontSize: 14, color: grey700}}>{this.props.data.moneyLocations.find(each => each.get('id') === item.money_location_id).get('name')}</span>
                            )}
                        </Col>
                    </Row>
                    {this.state.expanded && (
                        <div>
                            <Row style={{fontSize: 14, color: grey500}}>
                                <Col xs={6}>{moment(item.created_at).format('lll')}</Col>
                                <Col xs={6} style={{textAlign: 'right'}}>{item.repeat ? `Repeats ${RepeatOptions.filter(each => each[0] === item.repeat)[0][1]}` : 'Does not repeat'}</Col>
                            </Row>
                            <div style={{
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}>
                                {this.props.data.categories.map(each => item.categories.includes(each.get('id')) ? (
                                    <Chip
                                        key={each.get('id')}
                                        style={{margin: '5px 5px 0 0'}}
                                    >
                                        {each.get('name')}
                                    </Chip>
                                ) : null)}
                            </div>
                        </div>
                    )}
                </ListItem>
            )
        );
    }
}
