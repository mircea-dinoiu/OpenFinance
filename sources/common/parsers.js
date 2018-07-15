// @flow
import React from 'react';

export const parseCRUDError = (json) => {
    let error = json;

    if (Array.isArray(json)) {
        error = (
            <ul>
                {json.map((each) =>
                    Object.entries(each).map(([key, messages]) => (
                        <li key={key}>
                            {key}
                            <ul>
                                {messages.map((message) => <li key={message}>{message}</li>)}
                            </ul>
                        </li>
                    )),
                )}
            </ul>
        );
    }

    return error;
};
