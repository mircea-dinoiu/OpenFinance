module.exports = (sequelize, types) =>
    sequelize.define(
        'stocks',
        {
            id: {type: types.INTEGER, primaryKey: true},
            symbol: types.STRING,
            type: types.STRING,
            currency_id: types.INTEGER,
            pricing_method: types.STRING,
        },
        {
            underscored: true,
        },
    );
