const { extractIdsFromModel } = require('../helpers');

module.exports = (sequelize, types) => {
    const Expense = sequelize.define(
        'expenses',
        {
            id: {
                type: types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            item: types.STRING,
            notes: types.STRING,
            money_location_id: types.INTEGER,
            status: types.STRING,
            type: types.STRING,
            sum: types.FLOAT,

            repeat: types.STRING,
            repeat_occurrences: types.INTEGER,
            repeat_end_date: types.DATE,
        },
        {
            underscored: true,
            classMethods: {
                associate(models) {
                    Expense.belongsToMany(models.User, {
                        through: models.ExpenseUser,
                        timestamps: false,
                    });
                    Expense.belongsToMany(models.Category, {
                        through: 'category_expense',
                        timestamps: false,
                    });

                    Expense.addScope('default', {
                        attributes: Object.keys(Expense.rawAttributes).concat([
                            ['GROUP_CONCAT(DISTINCT `users`.`id`)', 'userIds'],
                            [
                                'GROUP_CONCAT(DISTINCT `categories`.`id`)',
                                'categoryIds',
                            ],
                        ]),
                        include: [
                            {
                                model: models.User,
                                where: ['`users.expense_user`.`blame` = 1'],
                                attributes: [],
                            },
                            { model: models.Category, attributes: [] },
                        ],
                        group: ['id'],
                    });
                },
            },
            instanceMethods: {
                toJSON() {
                    const values = Object.assign({}, this.dataValues);

                    values.users = extractIdsFromModel(this, 'userIds');
                    delete values.userIds;

                    values.categories = extractIdsFromModel(
                        this,
                        'categoryIds',
                    );
                    delete values.categoryIds;

                    return values;
                },
            },
        },
    );

    return Expense;
};
