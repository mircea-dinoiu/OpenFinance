module.exports = (sequelize, types) =>
    sequelize.define(
        'money_locations',
        {
            id: {
                type: types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: types.STRING,
            url: types.STRING,
            type: types.STRING,
            currency_id: types.INTEGER,
            status: types.STRING,
            project_id: types.INTEGER,
            owner_id: types.INTEGER,
            credit_limit: types.INTEGER,
            credit_apr: types.DECIMAL,
            credit_minpay: types.DECIMAL,
            credit_dueday: types.DECIMAL,
        },
        {
            timestamps: false,
        },
    );
