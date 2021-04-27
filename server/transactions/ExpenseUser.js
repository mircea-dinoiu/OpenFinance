module.exports = (sequelize, types) => {
    const ExpenseUser = sequelize.define(
        'expense_user',
        {
            user_id: types.INTEGER,
            expense_id: types.INTEGER,
            blame: types.INTEGER,
            seen: types.INTEGER,
        },
        {
            timestamps: false,
            tableName: 'expense_user',
            underscored: true,
            classMethods: {
                associate(models) {
                    ExpenseUser.hasMany(models.Expense, {
                        foreignKey: 'id',
                    });
                    ExpenseUser.hasMany(models.User, {
                        foreignKey: 'id',
                    });
                },
            },
        },
    );

    return ExpenseUser;
};
