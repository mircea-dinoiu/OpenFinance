import {mapSearchToWords} from './mapSearchToWords';
import Sequelize from 'sequelize';
import {getDb} from '../getDb';
import {trim} from 'lodash';
import {mapColsToConcatArgs} from './mapColsToConcatArgs';

export const mapSearchKeywordToWheres = (kw: string, cols: string[]) => {
    const words = mapSearchToWords(kw);

    return words.map((w) => {
        const concat = cols.length > 1 ? Sequelize.fn('concat', ...mapColsToConcatArgs(cols)) : cols[0];

        return Sequelize.where(Sequelize.fn('lower', concat), {
            $like: `%${w.toLowerCase()}%`,
        });
    });
};

export const mapSearchKeywordToLiteralWheres = (kw: string, colName: string) => {
    const words = mapSearchToWords(kw);

    return words.map((w) => `LOWER(${colName}) LIKE '%${trim(getDb().escape(w), "'")}%'`).join(' AND ');
};
