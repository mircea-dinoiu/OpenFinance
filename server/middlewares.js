const {sql} = require('./models');
const {Validator} = require('./validators');
const {QueryTypes} = require('sequelize');

module.exports = {
    validateAuth: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.status(401);
            res.json('You are not logged in.');
        }
    },

    validateProject: async (req, res, next) => {
        if (req.query.projectId) {
            const results = await sql.query(
                `select * from project_user where project_id = :projectId AND user_id = :userId;`,
                {
                    replacements: {
                        userId: req.user.id,
                        projectId: Number(req.query.projectId),
                    },
                    type: QueryTypes.SELECT,
                },
            );

            if (results.length) {
                req.projectId = Number(req.query.projectId);
                next();
            } else {
                res.status(404);
                res.json('Project not found');
            }
        } else {
            res.status(400);
            res.json('Provide projectId');
        }
    },

    validatePayload: (rules, type = 'body') => (req, res, next) => {
        const validator = new Validator(req[type], rules, {req});

        validator.passes().then((passed) => {
            if (passed) {
                next();
            } else {
                res.status(400);
                res.json(validator.errors());
            }
        });
    },

    validateGuest: (req, res, next) => {
        if (!req.user) {
            next();
        } else {
            res.status(401);
            res.json('You are already logged in.');
        }
    },
};
