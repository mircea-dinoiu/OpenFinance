// @flow
import {objectEntriesOfSameType} from 'common/utils/collection';
import {startCase} from 'lodash';
import * as React from 'react';

export const parseCRUDError = (
    json: {
        [key: string]: string[],
    }[],
) => {
    let error = json;

    if (Array.isArray(json)) {
        error = (
            <>
                <strong>The following errors occurred:</strong>
                <ul style={{margin: 0}}>
                    {json.map((each) =>
                        objectEntriesOfSameType(each).map(([key, messages]) => (
                            <li key={key}>
                                {startCase(key)}: {messages.join(', ')}
                            </li>
                        )),
                    )}
                </ul>
            </>
        );
    }

    return error;
};
