import { getDetachedItemUpdates, mergeItems } from './helpers';

describe('#getDetachedItemUpdates()', () => {
    it('should return item id + repeat null by default', () => {
        expect(getDetachedItemUpdates({ id: 300 })).toEqual({
            id: 300,
            repeat: null,
        });
    });

    describe('When repeat_occurrences is not null', () => {
        describe('When repeat_occurrences = 1', () => {
            it('should set it to null', () => {
                expect(
                    getDetachedItemUpdates({
                        id: 300,
                        repeat_occurrences: 1,
                    }),
                ).toEqual({ id: 300, repeat: null, repeat_occurrences: null });
            });
        });

        describe('When repeat_occurrences > 1', () => {
            it('should decrease it by 1', () => {
                expect(
                    getDetachedItemUpdates({
                        id: 300,
                        repeat_occurrences: 2,
                    }),
                ).toEqual({ id: 300, repeat: null, repeat_occurrences: 1 });
            });
        });
    });
});

describe('#mergeItems()', () => {
    describe('When there are not enough items', () => {
        it('Should return null', () => {
            expect(mergeItems([{}])).toEqual(null);
        });
    });

    describe('When there are enough items', () => {
        describe('When money_location_id does not match', () => {
            it('Should return null', () => {
                expect(
                    mergeItems([
                        { money_location_id: 1 },
                        { money_location_id: 2 },
                    ]),
                ).toEqual(null);
            });
        });

        describe('When money_location_id matches', () => {
            it('Should return the merged object', () => {
                expect(
                    mergeItems([
                        {
                            money_location_id: 1,
                            categories: [1, 2],
                            favorite: 1,
                            item: 'Foo',
                            sum: 1,
                            weight: 0,
                            users: { 1: 100 },
                        },
                        {
                            money_location_id: 1,
                            categories: [2, 3],
                            favorite: 2,
                            item: 'Foo',
                            sum: 10,
                            weight: 20,
                            users: { 1: 100 },
                        },
                        {
                            money_location_id: 1,
                            categories: [2, 3],
                            favorite: 5,
                            item: 'Bar',
                            sum: 15,
                            weight: 30,
                            users: { 1: 30, 2: 70 },
                        },
                    ]),
                ).toEqual({
                    money_location_id: 1,
                    categories: [1, 2, 3],
                    favorite: 5,
                    item: 'Foo, Bar',
                    notes: '',
                    sum: 26,
                    weight: 50,
                    users: { '1': 77, '2': 23 },
                });
            });
        });
    });
});
