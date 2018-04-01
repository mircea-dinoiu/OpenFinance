'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      queryInterface.sequelize.query(`
ALTER TABLE incomes
  ADD COLUMN currency_id INT UNSIGNED NOT NULL DEFAULT 2,
  ADD CONSTRAINT incomes_currency_id_foreign FOREIGN KEY (currency_id)
  REFERENCES currencies(id);
      `);
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
