import {Action, GlobalState, LazyLoadedState, LazyLoadedStateWithFetch} from 'app/state/defs';
import {createAction, createReducer} from '@reduxjs/toolkit';
import {useSelector, useDispatch} from 'react-redux';
import {useSelectedProject} from 'projects/state';
import {createXHR} from 'app/fetch';
import {makeUrl} from 'app/url';
import {useEffect} from 'react';

const stateKeysWithoutReducers: string[] = [];

export const bindToUpdateState = <T extends object>(prop: string, defaultValue: T) => {
    stateKeysWithoutReducers.push(prop);

    return (
        state = defaultValue,
        action: {
            type: Action;
            state: T;
        },
    ) => {
        if (action.type === Action.UPDATE_STATE) {
            Object.keys(action.state).forEach((key) => {
                if (!stateKeysWithoutReducers.includes(key)) {
                    throw new Error(
                        `${key} has its own reducer. Please use action ${
                            Action.UPDATE_STATE
                        } only for ${stateKeysWithoutReducers.join(', ')}`,
                    );
                }
            });

            if (action.state.hasOwnProperty(prop)) {
                return action.state[prop];
            }
        }

        return state;
    };
};

export const makeCrudReducer = <T>({
    initialState,
    name,
    route,
    parse,
}: {
    initialState: T;
    name: string;
    route: string;
    parse?: (a: T) => T;
}) => {
    const Action = {
        set: `${name}/set`,
    };

    const reducer = createReducer<LazyLoadedState<T>>(
        {
            data: initialState,
            isLoaded: false,
            isLoading: false,
        },
        {
            [Action.set]: (
                state,
                {
                    payload,
                }: {
                    payload: LazyLoadedState<T>;
                },
            ) => payload,
        },
    );
    const actionSet = createAction<T>(Action.set);
    const useIt = (): LazyLoadedStateWithFetch<T> => {
        const {data, isLoaded, isLoading} = useSelector((s: GlobalState) => s[name]);
        const dispatch = useDispatch();
        const project = useSelectedProject();
        const fetch = async () => {
            dispatch(
                actionSet({
                    data,
                    isLoaded,
                    isLoading: true,
                }),
            );

            const r = await createXHR<T>({
                url: makeUrl(route, {projectId: project.id}),
            });

            dispatch(
                actionSet({
                    data: parse ? parse(r.data) : r.data,
                    isLoaded: true,
                    isLoading: false,
                }),
            );
        };

        useEffect(() => {
            if (!isLoaded && !isLoading) {
                fetch();
            }
        }, [project.id, isLoading, isLoaded]);

        return {
            fetch,
            data,
            isLoaded,
            isLoading,
        };
    };

    return {
        hook: useIt,
        reducer,
    };
};
