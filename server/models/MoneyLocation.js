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
            type_id: types.INTEGER,
            currency_id: types.INTEGER,
            status: types.STRING,
        },
        {
            timestamps: false,
        },
    );
