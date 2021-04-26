import {getInventoryModel} from '../models';
import {BaseController} from './BaseController';

export class InventoryController extends BaseController {
    constructor() {
        super(getInventoryModel());
    }
}
