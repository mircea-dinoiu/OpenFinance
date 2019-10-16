const {uniqueId} = require('lodash');

const sql = require('sequelize');

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

    switch (flags.Deposit) {
        case 'no':
            where.push({
                type: {
                    $ne: 'deposit',
                },
            });
            break;
        case 'only':
            where.push({
                type: {
                    $eq: 'deposit',
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
    sorters
        .map((each) => `${each.id} ${each.desc ? 'DESC' : 'ASC'}`)
        .join(', ');

const mapInputToLimitOpts = (input) => {
    if (input.page != null && input.limit != null) {
        const offset = (input.page - 1) * input.limit;

        return {offset, limit: input.limit};
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

const mapGroupConcatToHavingSQL = (filter, groupConcatName, columnId) => {
    if (typeof filter === 'object') {
        const conditions = [];

        filter.value.forEach((eachId) => {
            conditions.push(
                sql.where(
                    sql.fn('Find_In_Set', eachId, sql.col(groupConcatName)),
                    {
                        [filter.mode === 'exclude' ? '$eq' : '$gt']: 0,
                    },
                ),
            );
        });

        return ['exclude', 'all'].includes(filter.mode)
            ? sql.and(...conditions)
            : sql.or(...conditions);
    } else if (filter === 'none') {
        return sql.where(sql.col(columnId), {
            $is: sql.literal('NULL'),
        });
    }

    return null;
};

const mapEntityFilterToWhereSQL = (filter, columnId) => {
    if (typeof filter === 'object') {
        return {
            [columnId]: {
                [filter.mode === 'exclude' ? '$ne' : '$eq']: filter.value,
            },
        };
    } else if (filter === 'none') {
        return {
            [columnId]: {
                $eq: sql.literal('NULL'),
            },
        };
    }

    return null;
};

const exported = {
    mapSortersToSQL,
    mapInputToLimitSQL,
    mapGroupConcatToHavingSQL,
    mapEntityFilterToWhereSQL,
    mapStartDateToSQL(startDate, Model, raw = false) {
        if (startDate) {
            if (raw) {
                return {
                    query: `${Model.tableName}.created_at >= ?`,
                    replacements: [startDate]
                };
            }

            return sql.or(
                sql.where(sql.col(`${Model.tableName}.created_at`), {
                    $gte: startDate,
                }),
                sql.where(sql.col(`${Model.tableName}.repeat`), {
                    $ne: null,
                }),
            );
        }

        return null;
    },
    mapEndDateToSQL(endDate, Model, raw = false) {
        if (endDate) {
            if (raw) {
                return {
                    query: `${Model.tableName}.created_at <= ?`,
                    replacements: [endDate]
                };
            }

            return sql.where(sql.col(`${Model.tableName}.created_at`), {
                $lte: endDate,
            });
        }
        return null;
    },
    mapTextFilterToSQL,
    mapFlagsToSQL,
};

module.exports = exported;
