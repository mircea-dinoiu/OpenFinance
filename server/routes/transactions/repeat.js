const {Expense: Model} = require('../../models');

module.exports = {
    detach: async ({req, res}) => {
        const {ids} = req.body;
        const prevHeads = await Model.findAll({
            where: {
                id: {
                    $in: ids,
                },
            },
        });
        const promises = [];

        for (const prevHead of prevHeads) {
            promises.push(
                prevHead.update({
                    repeat: null,
                    repeat_occurrences: 0,
                }),
            );
            promises.push(moveToNextHead(prevHead));
        }

        await Promise.all(promises);

        return res.sendStatus(200);
    },
    skip: async ({req, res}) => {
        const {ids} = req.body;
        const prevHeads = await Model.findAll({
            where: {
                id: {
                    $in: ids,
                },
            },
        });

        await Promise.all(prevHeads.map(moveToNextHead));
        await Promise.all(prevHeads.map((prevHead) => prevHead.destroy()));

        return res.sendStatus(200);
    },
};

const moveToNextHead = async (prevHead) => {
    const nextHead = await Model.findOne({
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
    });

    const nextLinkedUpdate = Model.update(
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
