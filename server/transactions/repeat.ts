import {getExpenseModel} from '../models';

export const detachTransactions = async ({req, res}) => {
    const {ids} = req.body;
    const prevHeads = await getExpenseModel().findAll({
        where: {
            id: ids,
        },
    });
    const promises: Promise<unknown>[] = [];

    for (const prevHead of prevHeads) {
        promises.push(
            prevHead.update({
                repeat: null,
                repeat_occurrences: null,
            }),
        );
        promises.push(moveToNextHead(prevHead));
    }

    await Promise.all(promises);

    return res.sendStatus(200);
};

export const skipTransactions = async ({req, res}) => {
    const {ids} = req.body;
    const prevHeads = await getExpenseModel().findAll({
        where: {
            id: ids,
        },
    });

    await Promise.all(prevHeads.map(moveToNextHead));
    await Promise.all(prevHeads.map((prevHead) => prevHead.destroy()));

    return res.sendStatus(200);
};

const moveToNextHead = async (prevHead) => {
    const nextHead = await getExpenseModel().findOne({
        where: {
            repeat_link_id: prevHead.id,
        },
        order: [['created_at', 'ASC']],
    });

    if (!nextHead) {
        return Promise.resolve();
    }

    const nextHeadUpdate = nextHead.update({
        repeat_link_id: null,
        ...(nextHead.repeat_occurrences === 1 ? {repeat_occurrences: null, repeat_factor: 1, repeat: null} : {}),
    });

    const nextLinkedUpdate = getExpenseModel().update(
        {
            repeat_link_id: nextHead.id,
        },
        {
            where: {
                repeat_link_id: prevHead.id,
            },
        },
    );

    return Promise.all([nextHeadUpdate, nextLinkedUpdate]);
};
