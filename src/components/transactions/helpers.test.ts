import {mergeItems} from 'components/transactions/helpers';

describe('#mergeItems()', () => {
    describe('When there are not enough items', () => {
        it('Should return null', () => {
            expect(mergeItems([{}])).toEqual(null);
        });
    });

    describe('When there are enough items', () => {
        describe('When money_location_id does not match', () => {
            it('Should return null', () => {
                expect(mergeItems([{money_location_id: 1}, {money_location_id: 2}])).toEqual(null);
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
                            price: 1,
                            weight: 0,
                            users: {1: 100},
                        },
                        {
                            money_location_id: 1,
                            categories: [2, 3],
                            favorite: 2,
                            item: 'Foo',
                            price: 10,
                            weight: 20,
                            users: {1: 100},
                        },
                        {
                            money_location_id: 1,
                            categories: [2, 3],
                            favorite: 5,
                            item: 'Bar',
                            price: 15,
                            weight: 30,
                            users: {1: 30, 2: 70},
                        },
                    ]),
                ).toEqual({
                    categories: [1, 2, 3],
                    favorite: 5,
                    item: 'Foo, Bar',
                    price: 26,
                    weight: 50,
                    users: {'1': 77, '2': 23},
                });
            });
        });
    });
});
