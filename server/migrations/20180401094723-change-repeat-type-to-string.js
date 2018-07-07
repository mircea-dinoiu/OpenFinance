'use strict';

module.exports = {
    up: (queryInterface) => {
        queryInterface.sequelize.query(
            `
ALTER TABLE expenses MODIFY \`repeat\` TINYTEXT;
ALTER TABLE incomes MODIFY \`repeat\` TINYTEXT;
        `,
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
