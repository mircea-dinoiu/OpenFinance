const {sql} = require('../models');
const {QueryTypes} = require('sequelize');

const filters = {
    auth: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.status(401);
            res.json('You are not logged in.');
        }
    },

    authProject: (req, res, next) => {
        filters.auth(req, res, async () => {
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
                    next();
                } else {
                    res.status(404);
                    res.json('Project not found');
                }
            } else {
                res.status(400);
                res.json('Provide projectId');
            }
        });
    },

    guest: (req, res, next) => {
        if (!req.user) {
            next();
        } else {
            res.status(401);
            res.json('You are already logged in.');
        }
    },
};

module.exports = filters;
