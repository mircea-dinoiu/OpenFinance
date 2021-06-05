module.exports = (sequelize, types) =>
    sequelize.define(
        'stock_prices',
        {
            stock_id: {type: types.INTEGER, primaryKey: true},
            dated: types.DATE,
            price: types.DECIMAL,
        },
        {
            underscored: true,
            timestamps: false,
        },
    );
