import {BaseController} from './BaseController';
import {getPropertyModel} from '../models';

export class PropertyController extends BaseController {
    constructor() {
        super(getPropertyModel());
    }
}
