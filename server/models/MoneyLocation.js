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
        },
        {
            timestamps: false,
        },
    );
