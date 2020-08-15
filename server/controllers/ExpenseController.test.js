const ExpenseController = require('./ExpenseController');

describe('#sanitizeCreateValues()', () => {
    it('should pick properties that do not need sanitizing', async () => {
        expect(
            ExpenseController.prototype.sanitizeCreateValues(
                {
                    sum: 300,
                    repeat: 'm',
                    money_location_id: 3,
                    unknown_prop: 44,
                    repeat_occurrences: 30,
                },
                {projectId: 1},
            ),
        ).toMatchInlineSnapshot(`
            Object {
              "money_location_id": 3,
              "project_id": 1,
              "repeat": "m",
              "repeat_occurrences": 30,
              "sum": 300,
            }
        `);
    });
});

describe('#sanitizeUpdateValues()', () => {
    it('should pick properties that do not need sanitizing', () => {
        expect(
            ExpenseController.prototype.sanitizeUpdateValues(
                {
                    sum: 300,
                    money_location_id: 4,
                    repeat_occurrences: 5,
                },
                {projectId: 1},
            ),
        ).toMatchInlineSnapshot(`
            Object {
              "money_location_id": 4,
              "project_id": 1,
              "repeat_occurrences": 5,
              "sum": 300,
            }
        `);
    });

    describe('When repeat is set to null', () => {
        it('should unset the other repeat relevant fields as well', () => {
            expect(
                ExpenseController.prototype.sanitizeUpdateValues(
                    {
                        repeat: null,
                        repeat_occurrences: 30,
                        repeat_end_date: '2018-01-01',
                    },
                    {projectId: 1},
                ),
            ).toMatchInlineSnapshot(`
                Object {
                  "project_id": 1,
                  "repeat": null,
                  "repeat_occurrences": 0,
                }
            `);
        });
    });
});
