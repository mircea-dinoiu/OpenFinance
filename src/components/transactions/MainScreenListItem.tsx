import {Card, Container, Divider} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {SmartDrawer} from 'components/drawers';
import {ContextMenuItems, TypeContextMenuItemsProps} from 'components/MainScreen/ContextMenu/ContextMenuItems';
import React, {useState} from 'react';

export type MainScreenListItemProps<
    Item extends {
        id: number;
        repeat_link_id: number | null;
    }
> = {
    entityName: string;
    contentComponent: React.ComponentType<{item: Item; expanded?: boolean}>;
    onReceiveSelectedIds: (ids: number[]) => void;
    contextMenuItemsProps: TypeContextMenuItemsProps;
    item: Item;
};

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    moreIcon: {
        padding: 0,
    },
}));

export const MainScreenListItem = <
    Item extends {
        id: number;
        repeat_link_id: number | null;
    }
>(
    props: MainScreenListItemProps<Item>,
) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const item = props.item;
    const ListItemContent = props.contentComponent;
    const cls = useStyles();

    const handleOpenDrawer = () => {
        props.onReceiveSelectedIds([props.item.id]);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => setIsDrawerOpen(false);

    return (
        <>
            <Card
                square={true}
                variant={'outlined'}
                className={cls.container}
                onClick={item.repeat_link_id === null ? handleOpenDrawer : undefined}
            >
                <ListItemContent item={item} />
            </Card>
            <SmartDrawer onClose={handleCloseDrawer} open={isDrawerOpen}>
                <Container className={cls.container}>
                    <ListItemContent item={item} expanded={true} />
                </Container>
                <Divider />
                <ContextMenuItems {...props.contextMenuItemsProps} onCloseContextMenu={handleCloseDrawer} />
            </SmartDrawer>
        </>
    );
};
