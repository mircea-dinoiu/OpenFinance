import express from 'express';
import {CategoryController} from '../controllers/CategoryController';
import {validateAuth, validateProject, validatePayload} from '../middlewares';
import {getCategoryModel} from '../models';

export const createCategoriesRouter = () => {
    const router = express.Router();
    const c = new CategoryController();

    router.get('/', [validateAuth, validateProject], async (req, res) => {
        c.list(req, res);
    });

    router.delete(
        '/',
        [
            validateAuth,
            validateProject,
            validatePayload({
                ids: ['isRequired', ['isIdArray', getCategoryModel()]],
            }),
        ],
        (req, res) => {
            c.destroy(req, res);
        },
    );

    router.put('/', [validateAuth, validateProject], (req, res) => {
        c.update(req, res);
    });

    router.post('/', [validateAuth, validateProject], (req, res) => {
        c.create(req, res);
    });

    return router;
};
