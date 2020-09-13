const {extractIdsFromModel, extractUsersFromModel} = require('../helpers');

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
            fitid: types.STRING,
            money_location_id: types.INTEGER,
            project_id: types.INTEGER,
            status: types.STRING,
            sum: types.FLOAT,
            favorite: types.INTEGER,
            hidden: types.INTEGER,

            repeat: types.STRING,
            repeat_occurrences: types.INTEGER,
            repeat_link_id: types.INTEGER,

            stock_units: types.FLOAT,
            stock_id: types.INTEGER,

            weight: types.INTEGER,

            sum_per_weight: {
                type: types.VIRTUAL(
                    types.FLOAT,
                    '(`expenses`.sum / `expenses`.weight) as sum_per_weight',
                ),
            },
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
                    Expense.belongsTo(models.MoneyLocation);
                    Expense.belongsTo(models.Stock);

                    Expense.addScope('default', {
                        attributes: Object.keys(Expense.rawAttributes).concat([
                            [
                                "GROUP_CONCAT(DISTINCT CONCAT(`users`.`id`, ':', `users.expense_user`.`blame`))",
                                'userBlameMap',
                            ],
                            ['GROUP_CONCAT(DISTINCT `users`.`id`)', 'userIds'],
                            [
                                'GROUP_CONCAT(DISTINCT `categories`.`id`)',
                                'categoryIds',
                            ],
                        ]),
                        include: [
                            {
                                model: models.User,
                                where: ['`users.expense_user`.`blame` > 0'],
                            },
                            {model: models.Category, attributes: []},
                            {
                                model: models.MoneyLocation,
                                attributes: ['currency_id'],
                            },
                        ],
                        group: ['id'],
                    });
                },
            },
            instanceMethods: {
                toJSON() {
                    const values = Object.assign({}, this.dataValues);

                    if (values.userBlameMap) {
                        values.users = extractUsersFromModel(this);
                    }

                    values.categories = extractIdsFromModel(
                        this,
                        'categoryIds',
                    );

                    delete values.userIds;
                    delete values.userBlameMap;
                    delete values.categoryIds;

                    values.hidden = Boolean(values.hidden);

                    return values;
                },
            },
        },
    );

    return Expense;
};
