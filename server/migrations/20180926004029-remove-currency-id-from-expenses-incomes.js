'use strict';

module.exports = {
    up: (queryInterface) => {
        [
            'ALTER TABLE incomes DROP FOREIGN KEY incomes_currency_id_foreign',
            'ALTER TABLE incomes DROP COLUMN currency_id',
            'ALTER TABLE expenses DROP FOREIGN KEY expenses_currency_id_foreign',
            'ALTER TABLE expenses DROP COLUMN currency_id',
        ].forEach((query) => {
            queryInterface.sequelize.query(query);
        });
    },

    down: () => {
        /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    },
};
