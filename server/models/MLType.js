module.exports = (sequelize, types) => sequelize.define(
    'money_location_types',
    {
        id: {
            type: types.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: types.STRING
    },
    {
        timestamps: false
    }
);
