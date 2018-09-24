'use strict';

module.exports = {
    up: (queryInterface) => {
        queryInterface.sequelize.query(
            'ALTER TABLE expenses MODIFY money_location_id INT UNSIGNED NOT NULL;',
        );
        queryInterface.sequelize.query(
            'ALTER TABLE incomes MODIFY COLUMN money_location_id INT UNSIGNED NOT NULL;',
        );
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
