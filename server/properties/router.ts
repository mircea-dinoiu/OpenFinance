import express from 'express';
import {PropertyController} from './controller';
import {validateAuth, validateProject, validatePayload} from '../middlewares';
import {getPropertyModel} from '../models';

export const createPropertiesRouter = () => {
    const router = express.Router();
    const c = new PropertyController();
    const Model = getPropertyModel();

    router.get('/', [validateAuth, validateProject], async (req, res) => {
        c.list(req, res);
    });

    router.delete(
        '/',
        [
            validateAuth,
            validateProject,
            validatePayload({
                ids: ['isRequired', ['isIdArray', Model]],
            }),
        ],
        (req, res) => {
            // c.destroy(req, res);
        },
    );

    router.put('/', [validateAuth, validateProject], (req, res) => {
        // c.update(req, res);
    });

    router.post('/', [validateAuth, validateProject], (req, res) => {
        // c.create(req, res);
    });

    return router;
};
