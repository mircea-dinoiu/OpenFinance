import {getUserHasProjectAccess} from '../projects/getUserHasProjectAccess';
import ical from 'ical-generator';
import {getExpenseModel, getProjectModel} from '../models';
import moment from 'moment';
import Sequelize from 'sequelize';
import {URLSearchParams} from 'url';
import {getUserByAppPassword} from '../users/getUserByAppPassword';

export const getCalendar = async (req, res) => {
    const {email, password} = req.query;
    const year = Number(req.query.year);
    const projectId = Number(req.query.projectId);

    const user = await getUserByAppPassword(email, password);

    if (!user) {
        res.sendStatus(400);

        return;
    }

    const isOk = await getUserHasProjectAccess(user.id, projectId);

    if (!isOk) {
        res.sendStatus(400);

        return;
    }

    const project = await getProjectModel().findById(projectId);
    const calendar = ical({name: `${project?.name} ${year} - OpenFinance`});
    const transactions = await getExpenseModel().findAll({
        attributes: ['id', 'item', 'created_at', 'notes'],
        where: Sequelize.and(
            Sequelize.where(Sequelize.col('project_id'), {$eq: projectId}),
            Sequelize.where(Sequelize.col('hidden'), {$eq: false}),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('created_at')), {
                $eq: year,
            }),
        ),
    });

    transactions.forEach((t) => {
        const urlSearchParams = new URLSearchParams();

        urlSearchParams.set('filters', JSON.stringify([{id: 'id', value: String(t.id)}]));

        calendar.createEvent({
            start: moment(t.created_at),
            end: moment(t.created_at).add(1, 'minute'),
            summary: t.item,
            description: t.notes,
            url: `${process.env.DOMAIN}/#/p/${projectId}/transactions?${urlSearchParams.toString()}`,
        });
    });

    calendar.serve(res);
};
