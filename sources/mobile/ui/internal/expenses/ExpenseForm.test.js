import { setChargedPersonValueFactory } from './ExpenseForm';

describe('#setChargedPersonValueFactory()', () => {
    describe('When adjust is true', () => {
        describe('When adding a new value that makes the max overflow', () => {
            it('Should adjust the adjacent values', () => {
                expect(
                    setChargedPersonValueFactory(2, 50, {
                        userIdsStringified: ['1', '2'],
                    })({
                        chargedPersons: {
                            1: 100,
                        },
                    }),
                ).toEqual({
                    chargedPersons: {
                        1: 50,
                        2: 50,
                    },
                });
                expect(
                    setChargedPersonValueFactory(1, 50, {
                        userIdsStringified: ['1'],
                    })({
                        chargedPersons: {
                            1: 100,
                        },
                    }),
                ).toEqual({
                    chargedPersons: {
                        1: 100,
                    },
                });
                expect(
                    setChargedPersonValueFactory(2, 60, {
                        userIdsStringified: ['1', '2'],
                    })({
                        chargedPersons: {
                            1: 80,
                            2: 20,
                        },
                    }),
                ).toEqual({
                    chargedPersons: {
                        1: 40,
                        2: 60,
                    },
                });
            });
        });

        describe('When adding a new value that makes the max underflow', () => {
            it('Should adjust the adjacent values', () => {
                expect(
                    setChargedPersonValueFactory(2, 30, {
                        userIdsStringified: ['1', '2'],
                    })({
                        chargedPersons: {
                            1: 10,
                            2: 90,
                        },
                    }),
                ).toEqual({
                    chargedPersons: {
                        1: 70,
                        2: 30,
                    },
                });
            });
        });
    });

    describe('When adjust is false', () => {
        it('Should NOT adjust the adjacent values', () => {
            expect(
                setChargedPersonValueFactory(2, 30, {
                    userIdsStringified: ['1', '2'],
                    adjust: false,
                })({
                    chargedPersons: {
                        1: 10,
                        2: 90,
                    },
                }),
            ).toEqual({
                chargedPersons: {
                    1: 10,
                    2: 30,
                },
            });
        });
    });
});
