module.exports = (sequelize, types) => {
    return sequelize.define('settings', {
        key: types.STRING,
        id: {
            type: types.INTEGER,
            primaryKey: true,
        },
        value: types.STRING,
    }, {
        underscored: true,
    });
};