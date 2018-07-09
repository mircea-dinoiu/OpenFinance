const moment = require('moment');
const standardDate = (value, format) =>
    moment(value, format).format('YYYY-MM-DD HH:mm:ss');
const formatYMD = (date = new Date()) => moment(date).format('YYYY-MM-DD');

module.exports = { standardDate, formatYMD };
