import Sequelize from 'sequelize';

export const mapColsToConcatArgs = (cols: string[]) => {
    return cols
        .map((c) => [' ', Sequelize.col(c)])
        .flat()
        .slice(1);
};
