const {isPlainObject} = require('lodash');
const Messages = require('../Messages');

module.exports = {
    async postDelete(req, res) {
        const err = () => {
            res.status(400);

            return Messages.ERROR_INVALID_INPUT;
        };
        const {data} = req.body;

        if (data && Array.isArray(data)) {
            const output = [];

            for (const record of data) {
                if (isPlainObject(record) ) {
                    const model = await this.Model.findOne({where: {id: record.id}});

                    if (model) {
                        output.push(model.toJSON());

                        await model.destroy();
                    } else {
                        output.push({
                            id: Messages.ERROR_INVALID_ID
                        });
                    }
                } else {
                    output.push(Messages.ERROR_INVALID_RECORD);
                }
            }

            return output;
        } else {
            return err();
        }
    }
};