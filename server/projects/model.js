module.exports = (sequelize, types) =>
    sequelize.define(
        'projects',
        {
            id: {
                type: types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: types.STRING,
        },
        {
            underscored: true,
            timestamps: false,
        },
    );
