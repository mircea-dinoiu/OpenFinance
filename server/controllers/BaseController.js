const {isPlainObject} = require('lodash');

module.exports = {
    INVALID_INPUT_MESSAGE: 'Invalid input',

    async postDelete(req, res) {
        const err = () => {
            res.status(400);

            return this.INVALID_INPUT_MESSAGE;
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

                        continue;
                    }
                }

                output.push({
                    id: this.INVALID_INPUT_MESSAGE
                });
            }

            return output;
        } else {
            return err();
        }
    }
};