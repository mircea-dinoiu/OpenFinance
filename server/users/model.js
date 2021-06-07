const {omit} = require('lodash');

module.exports = (sequelize, types) =>
    sequelize.define(
        'users',
        {
            id: {
                type: types.INTEGER,
                primaryKey: true,
            },
            email: types.STRING,
            password: types.STRING,
            first_name: types.STRING,
            last_name: types.STRING,
            is_admin: types.BOOLEAN,
        },
        {
            underscored: true,
            getterMethods: {
                full_name() {
                    return `${this.getDataValue('first_name')} ${this.getDataValue('last_name')}`;
                },
            },
            instanceMethods: {
                toJSON() {
                    return Object.assign({}, omit(this.dataValues, 'email', 'password'), {
                        full_name: this.full_name,
                    });
                },
            },
        },
    );
