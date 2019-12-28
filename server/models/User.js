const md5 = require('md5');
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
            preferred_money_location_id: types.INTEGER,
        },
        {
            underscored: true,
            getterMethods: {
                full_name() {
                    return `${this.getDataValue(
                        'first_name',
                    )} ${this.getDataValue('last_name')}`;
                },
                avatar() {
                    return `https://www.gravatar.com/avatar/${md5(
                        this.getDataValue('email')
                            .trim()
                            .toLowerCase(),
                    )}`;
                },
            },
            instanceMethods: {
                toJSON() {
                    return Object.assign(
                        {},
                        omit(this.dataValues, 'email', 'password'),
                        {
                            full_name: this.full_name,
                            avatar: this.avatar,
                        },
                    );
                },
            },
        },
    );
