const { standardDate } = require('../helpers');

module.exports = (sequelize, types) => {
    const Expense = sequelize.define(
        'expenses',
        {
            currency_id: types.INTEGER,
            id: {
                type: types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            item: types.STRING,
            money_location_id: types.INTEGER,
            status: types.STRING,
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

                    if (values.userIds) {
                        values.users = values.userIds.split(',').map(Number);
                    } else {
                        values.users = [];
                    }

                    delete values.userIds;

                    if (values.categoryIds) {
                        values.categories = values.categoryIds
                            .split(',')
                            .map(Number);
                    } else {
                        values.categories = [];
                    }

                    delete values.categoryIds;

                    // FIXME TEMP WORKAROUND sources/desktop/app/model/ExpenseModel.js:15
                    values.created_at = standardDate(values.created_at);
                    values.updated_at = standardDate(values.updated_at);

                    return values;
                },
            },
        },
    );

    return Expense;
};
