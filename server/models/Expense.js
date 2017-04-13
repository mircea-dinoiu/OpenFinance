module.exports = (sequelize, types) => {
    const Expense =  sequelize.define('expenses', {
        // categories: types.STRING, // todo
        // users: types.STRING, // todo
        currency_id: types.INTEGER,
        id: {
            type: types.INTEGER,
            primaryKey: true,
        },
        item: types.STRING,
        money_location_id: types.INTEGER,
        repeat: types.STRING,
        status: types.STRING,
        sum: types.FLOAT,
    }, {
        underscored: true,
    });

    return Expense;
};