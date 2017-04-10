module.exports = (sequelize, types) => {
    return sequelize.define('incomes', {
        id: {
            type: types.INTEGER,
            primaryKey: true,
        },
    }, {
        underscored: true,
    });
};