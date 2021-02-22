import {routes} from 'defs/routes';
import {useDispatch, useSelector} from 'react-redux';
import {useSelectedProject} from 'state/projects';
import {GlobalState} from 'types';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';
import {createAction, createReducer} from '@reduxjs/toolkit';
import {sortBy} from 'lodash';

enum Action {
    received = 'inventories/received',
}

export const inventoriesReducer = createReducer<Inventory[]>([], {
    [Action.received]: (
        state,
        {
            payload,
        }: {
            payload: Inventory[];
        },
    ) => payload,
});

export type Inventory = {id: number; name: string; project_id: number};

const receiveInventories = createAction<Inventory[]>(Action.received);

export const useInventoriesReader = () => {
    const dispatch = useDispatch();
    const project = useSelectedProject();

    return async () => {
        const r = await createXHR<Inventory[]>({
            url: makeUrl(routes.inventories, {projectId: project.id}),
        });

        dispatch(receiveInventories(r.data));
    };
};

export const useInventories = (): Inventory[] => useSelector((s: GlobalState) => sortBy(s.inventories, 'name'));
