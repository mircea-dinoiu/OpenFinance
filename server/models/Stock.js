module.exports = (sequelize, types) =>
    sequelize.define(
        'stocks',
        {
            id: {type: types.INTEGER, primaryKey: true},
            symbol: types.STRING,
            type: types.STRING,
            price: types.FLOAT,
            currency_id: types.INTEGER,
            manual_pricing: types.BOOLEAN,
        },
        {
            underscored: true,
        },
    );
