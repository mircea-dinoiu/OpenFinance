import {CrudController} from '../CrudController';
import {getStockModel} from '../models';
import {getDb} from '../getDb';
import moment from 'moment';
import {QueryTypes} from 'sequelize';

export class StocksController extends CrudController {
    constructor() {
        super(getStockModel());
    }

    async list(req, res) {
        const sql = getDb();
        const queryDate = req.query.date;

        if (!moment(queryDate).isValid()) {
            return res.sendStatus(400);
        }

        const rows = await sql.query(
            `
                SELECT 
                    stocks.currency_id, 
                    stocks.id, 
                    stocks.symbol, 
                    stocks.type, 
                    (SELECT stock_prices.price FROM stock_prices WHERE stock_prices.stock_id = stocks.id ORDER BY ABS(DATEDIFF(:queryDate, stock_prices.dated)) ASC, stock_prices.price DESC LIMIT 1) AS price
                FROM stocks 
                ORDER BY symbol ASC;
            `,
            {
                replacements: {
                    queryDate,
                },
                type: QueryTypes.SELECT,
            },
        );

        res.json(rows);
    }
}
