'use strict';

module.exports = {
    up: (queryInterface) => {
        queryInterface.sequelize.query(
            'ALTER TABLE users DROP COLUMN remember_token;',
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
