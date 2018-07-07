import './Desktop.css';
import routes from 'common/defs/routes';
import lodash from 'lodash';

const Financial = {};

Financial.data = {};
Financial.routes = routes;
Financial.initialValues = {
    getEndDate() {
        try {
            const state = localStorage.getItem('FINANCIAL_STATE');
            const decoded = JSON.parse(state);
            const endDate = decoded.preferences.endDate;

            if (typeof endDate === 'string') {
                const newDate = new Date(endDate);

                newDate.setDate(newDate.getDate() + 1);

                return newDate;
            }
        } catch (e) {
            // noop
        }
        
        const date = new Date();

        date.setDate(1);
        date.setMonth(date.getMonth() + 1);

        return date;
    }
};

window._ = lodash;
window.Financial = Financial;