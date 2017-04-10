module.exports = (sequelize, types) => {
    const Expense =  sequelize.define('expenses', {
        id: {
            type: types.INTEGER,
            primaryKey: true,
        },
    }, {
        underscored: true,
    });

    return Expense;
};