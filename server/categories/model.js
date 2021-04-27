module.exports = (sequelize, types) => {
    const Category = sequelize.define(
        'categories',
        {
            name: types.STRING,
            id: {
                type: types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            project_id: types.INTEGER,
        },
        {
            underscored: true,
            classMethods: {
                associate(models) {
                    Category.belongsToMany(models.Expense, {
                        through: 'category_expense',
                        timestamps: false,
                    });
                },
            },
        },
    );

    return Category;
};
