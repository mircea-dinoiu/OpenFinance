import {pick} from 'lodash';
import {Validator} from '../validators';
import {sanitizeFilters, sanitizeSorters} from '../helpers';
import {
    mapStartDateToSQL,
    mapEndDateToSQL,
    mapFlagsToSQL,
    mapSortersToSQL,
    mapInputToLimitSQL,
    mapGroupConcatToHavingSQL,
    mapEntityFilterToWhereSQL,
} from '../helpers/sql';
import {getDb} from '../getDb';
import {getExpenseModel} from '../models';
import {FULL_DATE_FORMAT_TZ} from '../../src/app/dates/defs';
import {mapSearchKeywordToWheres} from '../helpers/mapSearchKeywordToWheres';

export const ExpenseService = {
    async list(req) {
        const {query} = req;
        const input = pick(query, 'start_date', 'end_date', 'filters', 'page', 'limit', 'sorters');
        const rules = {
            start_date: ['sometimes', ['isDateFormat', FULL_DATE_FORMAT_TZ]],
            end_date: ['isRequired', ['isDateFormat', FULL_DATE_FORMAT_TZ]],
            filters: [
                'sometimes',
                ['isTableFilters', [...Object.keys(getExpenseModel().attributes), 'categories', 'users']],
            ],
            page: ['sometimes', 'isInt'],
            limit: ['sometimes', 'isInt'],
            sorters: ['sometimes', ['isTableSorters', getExpenseModel(), ['money_location.currency_id']]],
        };
        const validator = new Validator(input, rules, {req});

        if (await validator.passes()) {
            const where: any[] = [
                {
                    project_id: Number(query.projectId),
                },
            ];
            let having: any[] = [];

            where.push(mapStartDateToSQL(input.start_date, getExpenseModel()));
            where.push(mapEndDateToSQL(input.end_date, getExpenseModel()));

            sanitizeFilters(input.filters).forEach(({id, value}) => {
                switch (id) {
                    case 'item':
                        if (value.text) {
                            mapSearchKeywordToWheres(value.text, ['item', 'notes']).map((w) => where.push(w));
                        }
                        where.push(mapFlagsToSQL(value));
                        break;
                    case 'categories':
                        having.push(
                            mapGroupConcatToHavingSQL(value, 'categoryIds', 'categories.category_expense.category_id'),
                        );
                        break;
                    case 'users':
                        having.push(mapGroupConcatToHavingSQL(value, 'userIds', 'users.expense_user.user_id'));
                        break;
                    case 'money_location_id':
                    case 'stock_id':
                    case 'inventory_id':
                        where.push(mapEntityFilterToWhereSQL(value, id));
                        break;
                    default:
                        where.push({
                            [id]: {
                                $eq: value,
                            },
                        });
                        break;
                }
            });

            const queryOpts: any = {
                where: getDb().and(...where.filter(Boolean)),
            };

            having = having.filter(Boolean);

            if (having.length) {
                queryOpts.having = getDb().and(...having);
            }

            const sorters = sanitizeSorters(input.sorters);

            queryOpts.order = mapSortersToSQL(sorters) + mapInputToLimitSQL(input);

            return {
                error: false,
                json: await getExpenseModel()
                    .scope('default')
                    .findAll(queryOpts),
            };
        }

        return {
            error: true,
            json: validator.errors(),
        };
    },
};
