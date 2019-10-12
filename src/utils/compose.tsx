// @flow

const compose = (...fns: Function[]) => (...args: any[]) => {
    fns.forEach((fn) => {
        if ('function' === typeof fn) {
            fn(...args);
        }
    });
};

export default compose;
