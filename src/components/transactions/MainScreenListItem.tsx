import React, {useState} from 'react';
import {
    ContextMenuItems,
    TypeContextMenuItemsProps,
} from 'components/MainScreen/ContextMenu/ContextMenuItems';
import {makeStyles} from '@material-ui/core/styles';
import {Container, Drawer, Divider, Card} from '@material-ui/core';
import {spacingMedium, spacingSmall} from 'defs/styles';

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

const useStyles = makeStyles({
    container: {
        padding: spacingMedium,
        marginBottom: spacingSmall,
    },
    moreIcon: {
        padding: 0,
    },
});

export const MainScreenListItem = (props: TypeProps) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const item = props.item;
    const ListItemContent = props.contentComponent;
    const cls = useStyles();

    const handleOpenDrawer = (event) => {
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
                onClick={item.persist === false ? undefined : handleOpenDrawer}
            >
                <ListItemContent item={item} />
            </Card>
            <Drawer
                onClose={handleCloseDrawer}
                open={isDrawerOpen}
                anchor="bottom"
            >
                <Container className={cls.container}>
                    <ListItemContent item={item} expanded={true} />
                </Container>
                <Divider />
                <ContextMenuItems
                    {...props.contextMenuItemsProps}
                    onCloseContextMenu={handleCloseDrawer}
                />
            </Drawer>
        </>
    );
};
