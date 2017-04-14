const moment = require('moment');
const {isPlainObject} = require('lodash');

module.exports = {
    isArray: (value) => {
        return Array.isArray(value);
    },
    isPlainObject: (value) => {
        return isPlainObject(value);
    },
    isDateFormat: (value, format) => {
        return moment(value, format).isValid();
    },
};