module.exports = (sequelize, types) =>
    sequelize.define(
        'stocks',
        {
            id: {type: types.INTEGER, primaryKey: true},
            symbol: types.STRING,
            price: types.FLOAT,
            currency_id: types.INTEGER,
        },
        {
            underscored: true,
        },
    );