module.exports = (sequelize, types) =>
    sequelize.define(
        'currencies',
        {
            id: { type: types.INTEGER, primaryKey: true },
            iso_code: types.STRING,
            currency: types.STRING,
            symbol: types.STRING,
        },
        {
            timestamps: false,
        },
    );
