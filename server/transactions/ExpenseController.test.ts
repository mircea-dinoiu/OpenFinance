import ExpenseController from './ExpenseController';

describe('#sanitizeCreateValues()', () => {
    it('should pick properties that do not need sanitizing', async () => {
        expect(
            ExpenseController.prototype.sanitizeCreateValues(
                {
                    price: 300,
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
              "price": 300,
              "project_id": 1,
              "repeat": "m",
              "repeat_occurrences": 30,
            }
        `);
    });
});

describe('#sanitizeUpdateValues()', () => {
    it('should pick properties that do not need sanitizing', () => {
        expect(
            ExpenseController.prototype.sanitizeUpdateValues(
                {
                    price: 300,
                    money_location_id: 4,
                    repeat_occurrences: 5,
                },
                {projectId: 1},
            ),
        ).toMatchInlineSnapshot(`
            Object {
              "money_location_id": 4,
              "price": 300,
              "project_id": 1,
              "repeat_occurrences": 5,
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
                  "repeat_factor": 1,
                  "repeat_occurrences": null,
                }
            `);
        });
    });
});
