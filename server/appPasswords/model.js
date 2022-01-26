module.exports = (sequelize, types) =>
    sequelize.define(
        'app_passwords',
        {
            id: {
                type: types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: types.STRING,
            password: types.STRING,
            user_id: types.INTEGER,
        },
        {
            underscored: true,
            timestamps: false,
        },
    );
