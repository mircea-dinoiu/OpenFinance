const moment = require('moment');

module.exports = (sequelize, types) => {
    const Expense =  sequelize.define('expenses', {
        currency_id: types.INTEGER,
        id: {
            type: types.INTEGER,
            primaryKey: true,
        },
        item: types.STRING,
        money_location_id: types.INTEGER,
        repeat: types.STRING,
        status: types.STRING,
        sum: types.FLOAT
    }, {
        underscored: true,
        classMethods: {
            associate: function (models) {
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
                        ['GROUP_CONCAT(DISTINCT users.id)', 'userIds'],
                        ['GROUP_CONCAT(DISTINCT categories.id)', 'categoryIds']
                    ]),
                    include: [
                        {
                            model: models.User,
                            where: ['`users.expense_user`.`blame` = 1']
                        },
                        {model: models.Category, attributes: []}
                    ],
                    group: ['id']
                });
            }
        },
        instanceMethods: {
            toJSON: function () {
                const values = Object.assign({}, this.dataValues);

                if (values.userIds) {
                    values.users = values.userIds.split(',').map(Number);
                    delete values.userIds;
                }

                if (values.categoryIds) {
                    values.categories = values.categoryIds.split(',').map(Number);
                    delete values.categoryIds;
                }

                // FIXME TEMP WORKAROUND sources/desktop/app/model/ExpenseModel.js:15
                values.created_at = moment(values.created_at).format('YYYY-MM-DD HH:mm:ss');
                values.updated_at = moment(values.updated_at).format('YYYY-MM-DD HH:mm:ss');

                return values;
            }
        }
    });

    return Expense;
};