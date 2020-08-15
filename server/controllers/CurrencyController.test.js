const CurrencyController = require('./CurrencyController');

describe('#isExpired()', () => {
    describe('When cached timestamp is null', () => {
        it('Should return true', () => {
            expect(CurrencyController.isExpired({})).toBeTruthy();
        });
    });

    describe('When diff is higher than 1', () => {
        it('Should return true', () => {
            expect(
                CurrencyController.isExpired(
                    {
                        timestamp: new Date(2019, 0, 1),
                    },
                    new Date(2019, 0, 2).getTime(),
                ),
            ).toBeTruthy();
        });
    });

    describe('When diff is lower than 1', () => {
        it('Should return false', () => {
            expect(
                CurrencyController.isExpired(
                    {
                        timestamp: new Date(2019, 0, 1),
                    },
                    new Date(2019, 0, 1, 14).getTime(),
                ),
            ).toBeFalsy();
        });
    });
});
