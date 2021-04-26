import {memoize} from 'lodash';
import fs from 'fs';
import path from 'path';
import {getDb} from '../getDb';
import Sequelize from 'sequelize';
import {TUser} from '../../src/users/defs';
import {TCategory} from '../../src/categories/defs';
import {TCurrency} from '../../src/currencies/defs';
import {TransactionModel} from '../../src/transactions/defs';
import {TStock} from '../../src/stocks/defs';
import {TProperty} from '../../src/properties/defs';
import {TAccount} from '../../src/accounts/defs';
import {TInventory} from '../../src/inventories/defs';

type ModelType = Sequelize.Model<any, any> & {
    tableName: string;
    associate?: (db: any) => void;
    rawAttributes: any;
    attributes: any;
    name: string;
};

const getModels = memoize(() => {
    const basename = path.basename(module.filename);
    const sql = getDb();
    const models: Record<string, ModelType> = {};

    fs.readdirSync(__dirname)
        .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
        .forEach((file) => {
            const {name} = path.parse(file);
            const model = sql.import(path.join(__dirname, file));

            models[name] = model as ModelType;
        });

    Object.keys(models).forEach((modelName) => {
        models[modelName].associate?.(models);
    });

    return models;
});

export const getCategoryModel = (): Sequelize.Model<TCategory, unknown> => getModels().Category;
export const getCurrencyModel = (): Sequelize.Model<TCurrency, unknown> => getModels().Currency;
export const getExpenseModel = (): Sequelize.Model<TransactionModel, unknown> => getModels().Expense;
export const getInventoryModel = (): Sequelize.Model<TInventory, unknown> => getModels().Inventory;
export const getAccountModel = (): Sequelize.Model<TAccount, unknown> => getModels().MoneyLocation;
export const getPropertyModel = (): Sequelize.Model<TProperty, unknown> => getModels().Property;
export const getStockModel = (): Sequelize.Model<TStock, unknown> => getModels().Stock;
export const getUserModel = (): Sequelize.Model<TUser, unknown> => getModels().User;
