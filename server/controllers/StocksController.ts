import {BaseController} from './BaseController';
import {getStockModel} from '../models';

export class StocksController extends BaseController {
    constructor() {
        super(getStockModel());
    }

    async list(req, res) {
        res.json(
            await this.Model.findAll({
                order: [['symbol', 'ASC']],
            }),
        );
    }
}
