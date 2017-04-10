const md5 = require('md5');
const {pick} = require('lodash');

module.exports = (sequelize, types) => {
    return sequelize.define('users', {
        id: {
            type: types.INTEGER,
            primaryKey: true,
        },
        email: types.STRING,
        password: types.STRING,
        first_name: types.STRING,
        last_name: types.STRING,
        remember_token: types.STRING,
    }, {
        underscored: true,
        getterMethods: {
            full_name() {
                return `${this.getDataValue('first_name')} ${this.getDataValue('last_name')}`;
            },
            avatar() {
                return `https://www.gravatar.com/avatar/${md5(this.getDataValue('email').trim().toLowerCase())}`;
            },
        },
        instanceMethods: {
            toJSON() {
                return Object.assign({}, pick(
                    this.dataValues,
                    'id',
                    'first_name',
                    'last_name'
                ), {
                    full_name: this.full_name,
                    avatar: this.avatar
                });
            }
        }
    });
};