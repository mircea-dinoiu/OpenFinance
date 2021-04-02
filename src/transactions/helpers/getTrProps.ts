import {TransactionModel} from 'transactions/defs';
import {getTrClassName} from 'transactions/helpers/getTrClassName';

export const getTrProps = ({
                               onReceiveSelectedIds,
                               onEdit,
                               selectedIds,
                               onChangeContextMenu,
                               item,
                           }: {
    item: TransactionModel;
    onChangeContextMenu: (props: {display: boolean; top?: number; left?: number}) => void;
    onReceiveSelectedIds: (ids: number[]) => void;
    onEdit: () => void;
    selectedIds: number[];
}) => ({
    className: getTrClassName(item, {selectedIds}),
    onDoubleClick: () => {
        if (item.repeat_link_id === null) {
            onReceiveSelectedIds([item.id]);
            onEdit();
        } else {
            onReceiveSelectedIds([]);
        }
    },
    onClick(event: MouseEvent) {
        onChangeContextMenu({display: false});

        let nextSelected = selectedIds;

        if (event.metaKey || event.ctrlKey) {
            if (item.repeat_link_id === null) {
                if (selectedIds.includes(item.id)) {
                    nextSelected = nextSelected.filter((id) => id !== item.id);
                } else {
                    nextSelected = nextSelected.concat(item.id);
                }
            } else {
                return;
            }
        } else {
            nextSelected = item.repeat_link_id === null ? [item.id] : [];
        }

        onReceiveSelectedIds(nextSelected);
    },
    onContextMenu: (event: MouseEvent) => {
        event.preventDefault();

        if (item.repeat_link_id === null) {
            onChangeContextMenu({
                display: true,
                left: event.clientX,
                top: event.clientY,
            });

            if (!selectedIds.includes(item.id)) {
                onReceiveSelectedIds([item.id]);
            }
        }
    },
});
