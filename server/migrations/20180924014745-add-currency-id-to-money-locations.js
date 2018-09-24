'use strict';

module.exports = {
    up: (queryInterface) => {
        queryInterface.sequelize.query(
            'ALTER TABLE money_locations ADD COLUMN currency_id int unsigned not null',
        );
        queryInterface.sequelize.query(`
    ALTER TABLE money_locations ADD constraint money_locations_currency_id_foreign
		foreign key (currency_id) references currencies (id)`);
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
