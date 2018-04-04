import './Desktop.css';
import routes from 'common/defs/routes';
import lodash from 'lodash';

const Financial = {};

Financial.data = {};
Financial.routes = routes;
Financial.initialValues = {
    getEndDate: function () {
        const date = new Date();

        date.setDate(1);
        date.setMonth(date.getMonth() + 1);

        return date;
    }
};

window._ = lodash;
window.Financial = Financial;