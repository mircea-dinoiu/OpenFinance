import RepeatedModelsHelper from './RepeatedModelsHelper';

describe('#getClonesFor()', () => {
    describe('When repeat_occurrences is defined', () => {
        it('should restrict the clones to repeat_occurrences - 1', () => {
            const record = {
                id: 5,
                repeat: 'm',
                created_at: '2018-01-01 00:00:00',
                repeat_occurrences: 3,
            };
            const actual = RepeatedModelsHelper.getClonesFor({
                record: {
                    ...record,
                    toJSON: () => record,
                },
                endDate: '2019-01-01',
            });

            expect(
                JSON.stringify(actual)
            ).toEqual(JSON.stringify([
                {
                    repeat: 'm',
                    created_at: '2018-02-01 00:00:00',
                    repeat_occurrences: 3,
                    original: 5,
                    persist: false,
                },
                {
                    repeat: 'm',
                    created_at: '2018-03-01 00:00:00',
                    repeat_occurrences: 3,
                    original: 5,
                    persist: false,
                },
            ]));
        });
    });
});
