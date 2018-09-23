'use strict';

module.exports = {
    up: (queryInterface) => {
        queryInterface.sequelize.query(
            `
        ALTER TABLE expenses
        ADD COLUMN repeat_end_date TIMESTAMP NULL DEFAULT NULL,
        ADD COLUMN repeat_occurrences INT UNSIGNED NULL DEFAULT NULL;
        `,
        );
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
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
