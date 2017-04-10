module.exports = (sequelize, types) => {
    return sequelize.define('money_locations', {
        id: {
            type: types.INTEGER,
            primaryKey: true,
        },
        name: types.STRING,
        type_id: types.INTEGER,
    }, {
        timestamps: false,
    });
};