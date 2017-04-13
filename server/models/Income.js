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
    });
};