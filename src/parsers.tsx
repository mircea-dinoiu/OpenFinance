import {startCase} from 'lodash';
import React from 'react';

export const parseCRUDError = (
    json: {
        [key: string]: string[];
    }[],
): React.ReactNode => {
    if (Array.isArray(json)) {
        return (
            <>
                <strong>The following errors occurred:</strong>
                <ul style={{margin: 0}}>
                    {json.map((each) =>
                        Object.entries(each).map(([key, messages]) => (
                            <li key={key}>
                                {startCase(key)}: {messages.join(', ')}
                            </li>
                        )),
                    )}
                </ul>
            </>
        );
    }

    return String(json);
};
