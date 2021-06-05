import moment from 'moment';

export const formatYMD = (date: Date | number = new Date()) => moment(date).format('YYYY-MM-DD');
