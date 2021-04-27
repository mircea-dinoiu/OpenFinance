module.exports = (sequelize, types) =>
    sequelize.define(
        'inventories',
        {
            id: {
                type: types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: types.STRING,
            project_id: types.INTEGER,
        },
        {
            timestamps: false,
        },
    );
