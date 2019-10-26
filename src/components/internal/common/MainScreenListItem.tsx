import React, {PureComponent} from 'react';

import {cyan} from '@material-ui/core/colors';

import ResponsiveListItem from 'components/ResponsiveListItem';
import {IconButton, IconMenu} from 'material-ui';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ContextMenuItems, {
    TypeContextMenuItemsProps,
} from 'components/MainScreen/ContextMenu/ContextMenuItems';

type TypeProps = {
    entityName: string;
    contentComponent: any;
    onReceiveSelectedIds: (ids: number[]) => void;
    contextMenuItemsProps: TypeContextMenuItemsProps;
    item: {
        id: number;
        persist: boolean;
    };
};

type TypeState = {
    expanded: boolean;
};

class MainScreenListItem extends PureComponent<TypeProps, TypeState> {
    state = {
        expanded: false,
    };

    toggleDetails = () => {
        this.setState({
            expanded: !this.state.expanded,
        });
    };

    getStyle() {
        if (this.state.expanded) {
            return {
                backgroundColor: cyan[50],
            };
        }

        return {};
    }

    getInnerDivStyle() {
        return {paddingLeft: 40};
    }

    handleBurgerClick = (event) => {
        this.props.onReceiveSelectedIds([this.props.item.id]);
        event.stopPropagation();
    };

    render() {
        const item = this.props.item;
        const persist = item.persist !== false;
        const ListItemContent = this.props.contentComponent;
        const itemContent = (
            <ListItemContent item={item} expanded={this.state.expanded} />
        );

        return (
            <ResponsiveListItem
                onClick={this.toggleDetails}
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
                                vertical: 'top',
                            }}
                            targetOrigin={{
                                horizontal: 'left',
                                vertical: 'top',
                            }}
                            style={{marginLeft: 0, left: 0}}
                            onClick={this.handleBurgerClick}
                        >
                            <ContextMenuItems
                                {...this.props.contextMenuItemsProps}
                            />
                        </IconMenu>
                    ) : null
                }
            >
                {itemContent}
            </ResponsiveListItem>
        );
    }
}

export default MainScreenListItem;
