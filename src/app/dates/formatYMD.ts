import moment from 'moment';

export const formatYMD = (date: Date | string | number = new Date()) => moment(date).format('YYYY-MM-DD');
