import {useSelectedProject} from 'state/projects';
import {createXHR} from 'utils/fetch';
import {makeUrl} from 'utils/url';
import {routes} from 'defs/routes';
import {useState, useEffect} from 'react';

export type Property = {
    id: number;
    name: string;
    cost: number;
    market_value: number;
};

export const useProperties = () => {
    const project = useSelectedProject();
    const [data, setData] = useState<Property[] | null>(null);

    useEffect(() => {
        createXHR<Property[]>({
            url: makeUrl(routes.properties, {projectId: project.id}),
        }).then((r) => setData(r.data));
    }, []);

    return data;
};
