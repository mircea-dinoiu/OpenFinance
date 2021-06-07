import Sequelize from 'sequelize';

const mapFlagsToSQL = (flags: Record<'Pending' | 'Deposit' | 'Recurrent' | 'Generated', 'yes' | 'no' | 'only'>) => {
    const where: Record<string, Partial<Sequelize.WhereLogic>>[] = [];

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
                    // @ts-ignore
                    $eq: 'pending',
                },
            });
            break;
    }

    switch (flags.Deposit) {
        case 'no':
            where.push({
                price: {
                    $lt: 0,
                },
            });
            break;
        case 'only':
            where.push({
                price: {
                    $gt: 0,
                },
            });
            break;
    }

    switch (flags.Recurrent) {
        case 'no':
            where.push({
                repeat: {
                    // @ts-ignore
                    $eq: null,
                },
            });
            break;
        case 'only':
            where.push({
                repeat: {
                    // @ts-ignore
                    $ne: null,
                },
            });
            break;
    }

    switch (flags.Generated) {
        case 'yes':
            break;
        case 'only':
            where.push({
                repeat_link_id: {
                    // @ts-ignore
                    $ne: null,
                },
            });
            break;
        case 'no':
        default:
            where.push({
                repeat_link_id: {
                    // @ts-ignore
                    $eq: null,
                },
            });
            break;
    }

    return where;
};

const mapSortersToSQL = (sorters) => sorters.map((each) => `${each.id} ${each.desc ? 'DESC' : 'ASC'}`).join(', ');

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
        const conditions: Sequelize.where[] = [];

        filter.value.forEach((eachId) => {
            conditions.push(
                Sequelize.where(Sequelize.fn('Find_In_Set', eachId, Sequelize.col(groupConcatName)), {
                    [filter.mode === 'exclude' ? '$eq' : '$gt']: 0,
                }),
            );
        });

        return ['exclude', 'all'].includes(filter.mode) ? Sequelize.and(...conditions) : Sequelize.or(...conditions);
    } else if (filter === 'none') {
        return Sequelize.where(Sequelize.col(columnId), {
            $is: Sequelize.literal('NULL'),
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
                $eq: Sequelize.literal('NULL'),
            },
        };
    }

    return null;
};

export const mapStartDateToRawSql = (startDate, Model) => {
    if (startDate) {
        return {
            query: `${Model.tableName}.created_at >= ?`,
            replacements: [startDate],
        };
    }

    return null;
};

const mapStartDateToSQL = (startDate, Model) => {
    if (startDate) {
        return Sequelize.or(
            Sequelize.where(Sequelize.col(`${Model.tableName}.created_at`), {
                $gte: startDate,
            }),
            Sequelize.where(Sequelize.col(`${Model.tableName}.repeat`), {
                $ne: null,
            }),
        );
    }

    return null;
};

export const mapEndDateToRawSql = (endDate, Model) => {
    if (endDate) {
        return {
            query: `${Model.tableName}.created_at <= ?`,
            replacements: [endDate],
        };
    }

    return null;
};

const mapEndDateToSQL = (endDate, Model) => {
    if (endDate) {
        return Sequelize.where(Sequelize.col(`${Model.tableName}.created_at`), {
            $lte: endDate,
        });
    }

    return null;
};

export {
    mapSortersToSQL,
    mapInputToLimitSQL,
    mapGroupConcatToHavingSQL,
    mapEntityFilterToWhereSQL,
    mapStartDateToSQL,
    mapEndDateToSQL,
    mapFlagsToSQL,
};
