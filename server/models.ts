import {memoize} from 'lodash';
import path from 'path';
import {getDb} from './getDb';
import Sequelize from 'sequelize';
import {TUser} from '../src/users/defs';
import {TCategory} from '../src/categories/defs';
import {TCurrency} from '../src/currencies/defs';
import {TransactionModel} from '../src/transactions/defs';
import {TStock, TStockPrice} from '../src/stocks/defs';
import {TProperty} from '../src/properties/defs';
import {TAccount} from '../src/accounts/defs';
import {TInventory} from '../src/inventories/defs';
import assert from 'assert';
import * as fs from 'fs';
import {TProject} from '../src/projects/defs';
import {TAppPassword} from '../src/appPasswords/defs';

type ModelType = Sequelize.Model<any, any> & {
    tableName: string;
    associate?: (db: any) => void;
    rawAttributes: any;
    attributes: any;
    name: string;
};

const getModels = memoize(() => {
    const sql = getDb();
    const importModel = (p: string) => {
        const f = path.join(__dirname, p);

        assert(fs.existsSync(f), `Invalid file: ${f}`);

        return sql.import(f) as ModelType;
    };
    const models: Record<string, ModelType> = {
        Category: importModel('categories/model.js'),
        Currency: importModel('currencies/model.js'),
        Expense: importModel('transactions/model.js'),
        ExpenseUser: importModel('transactions/ExpenseUser.js'),
        Inventory: importModel('inventories/model.js'),
        MoneyLocation: importModel('accounts/model.js'),
        Property: importModel('properties/model.js'),
        Project: importModel('projects/model.js'),
        Stock: importModel('stocks/model.js'),
        StockPrice: importModel('stockPrices/model.js'),
        User: importModel('users/model.js'),
        AppPassword: importModel('appPasswords/model.js'),
    };

    Object.keys(models).forEach((modelName) => {
        models[modelName].associate?.(models);
    });

    return models;
});

export const getAccountModel = (): Sequelize.Model<TAccount, unknown> => getModels().MoneyLocation;
export const getCategoryModel = (): Sequelize.Model<TCategory, unknown> => getModels().Category;
export const getCurrencyModel = (): Sequelize.Model<TCurrency, unknown> => getModels().Currency;
export const getExpenseModel = (): Sequelize.Model<TransactionModel, unknown> => getModels().Expense;
export const getInventoryModel = (): Sequelize.Model<TInventory, unknown> => getModels().Inventory;
export const getPropertyModel = (): Sequelize.Model<TProperty, unknown> => getModels().Property;
export const getProjectModel = (): Sequelize.Model<TProject, unknown> => getModels().Project;
export const getStockModel = (): Sequelize.Model<TStock, unknown> => getModels().Stock;
export const getStockPriceModel = (): Sequelize.Model<TStockPrice, unknown> => getModels().StockPrice;
export const getUserModel = (): Sequelize.Model<TUser, unknown> => getModels().User;
export const getAppPasswordModel = (): Sequelize.Model<TAppPassword, unknown> => getModels().AppPassword;
