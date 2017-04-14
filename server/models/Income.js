const moment = require('moment');

module.exports = (sequelize, types) => {
    return sequelize.define('incomes', {
        id: {
            type: types.INTEGER,
            primaryKey: true,
        },
        description: types.STRING,
        money_location_id: types.INTEGER,
        repeat: types.STRING,
        status: types.STRING,
        sum: types.FLOAT,
        user_id: types.INTEGER,
    }, {
        underscored: true,
        instanceMethods: {
            toJSON: function () {
                const values = Object.assign({}, this.dataValues);

                // FIXME TEMP WORKAROUND sources/desktop/app/model/IncomeModel.js:15
                values.created_at = moment(values.created_at).format('YYYY-MM-DD HH:mm:ss');
                values.updated_at = moment(values.updated_at).format('YYYY-MM-DD HH:mm:ss');

                return values;
            }
        }
    });
};