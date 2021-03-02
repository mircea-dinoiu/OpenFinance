module.exports = (sequelize, types) =>
    sequelize.define(
        'properties',
        {
            id: {
                type: types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: types.STRING,

            cost: types.DECIMAL,
            market_value: types.DECIMAL,

            currency_id: types.INTEGER,
            project_id: types.INTEGER,
        },
        {
            underscored: true,
        },
    );
