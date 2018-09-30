const sql = require('sequelize');
const defs = require('../../shared/defs');
const moment = require('moment');

const mapTextFilterToSQL = (id, value) => {
    if (value) {
        return sql.where(sql.fn('LOWER', sql.col(id)), {
            $like: sql.fn('LOWER', `%${value.trim()}%`),
        });
    }

    return null;
};

const mapFlagsToSQL = (flags) => {
    const where = [];

    switch (flags.Pending) {
        case 'no':
            where.push({
                status: {
                    $ne: 'pending',
                },
            });
            break;
        case 'only':
            where.push({
                status: {
                    $eq: 'pending',
                },
            });
            break;
    }

    switch (flags.Recurrent) {
        case 'no':
            where.push({
                repeat: {
                    $eq: null,
                },
            });
            break;
        case 'only':
            where.push({
                repeat: {
                    $ne: null,
                },
            });
            break;
    }

    return where;
};

const mapSortersToSQL = (sorters) =>
    sorters.map((each) => `${each.id} ${each.desc ? 'DESC' : 'ASC'}`).join(', ');

const mapInputToLimitOpts = (input) => {
    if (input.page != null && input.limit != null) {
        const offset = (input.page - 1) * input.limit;

        return { offset, limit: input.limit };
    }

    return null;
};

// https://github.com/sequelize/sequelize/issues/3007
const mapInputToLimitSQL = (input) => {
    const opts = mapInputToLimitOpts(input);

    if (opts != null) {
        return ` LIMIT ${opts.offset}, ${opts.limit}`;
    }

    return '';
};

const exported = {
    mapSortersToSQL,
    mapInputToLimitSQL,
    mapStartDateToSQL(startDate, Model) {
        if (startDate) {
            return sql.or(
                sql.where(
                    sql.col(`${Model.tableName}.created_at`),
                    { $gte: startDate },
                ),
                sql.where(sql.col(`${Model.tableName}.repeat`), {
                    $ne: null,
                }),
            );
        }

        return null;
    },
    mapEndDateToSQL(endDate, Model) {
        return sql.where(
            sql.col(`${Model.tableName}.created_at`),
            {
                $lte: endDate,
            },
        );
    },
    mapTextFilterToSQL,
    mapFlagsToSQL,
};

module.exports = exported;
