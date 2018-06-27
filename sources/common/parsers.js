import React from 'react';

export const parseCRUDError = (json) => {
    let error = json;

    if (Array.isArray(json)) {
        error = (
            <div>
                {Object.values(json[0])
                    .map((each) => each[0])
                    .map((message) => <div key={message}>{message}</div>)}
            </div>
        );
    }

    return error;
};
