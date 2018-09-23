import ExpenseController from './ExpenseController';
import CurrencyController from './CurrencyController';

jest.mock('./CurrencyController');

beforeEach(() => {
    CurrencyController.getDefaultCurrency.mockImplementationOnce(() => ({
        id: 3,
    }));
});

describe('#sanitizeCreateValues()', () => {
    it('should pick properties that do not need sanitizing', async () => {
        expect(
            await ExpenseController.sanitizeCreateValues({
                sum: 300,
                repeat: 'm',
                money_location_id: 3,
                unknown_prop: 44,
                repeat_occurrences: 30,
            }),
        ).toEqual({
            sum: 300,
            repeat: 'm',
            money_location_id: 3,
            repeat_occurrences: 30,
            status: 'pending',
            currency_id: 3,
        });
    });
});

describe('#sanitizeUpdateValues()', () => {
    it('should pick properties that do not need sanitizing', () => {
        expect(
            ExpenseController.sanitizeUpdateValues({
                sum: 300,
                money_location_id: 4,
                repeat_occurrences: 5,
            }),
        ).toEqual({
            sum: 300,
            money_location_id: 4,
            repeat_occurrences: 5,
        });
    });

    describe('When repeat is set to null', () => {
        it('should unset the other repeat relevant fields as well', () => {
            expect(
                ExpenseController.sanitizeUpdateValues({
                    repeat: null,
                    repeat_occurrences: 30,
                    repeat_end_date: '2018-01-01',
                }),
            ).toEqual({
                repeat: null,
                repeat_end_date: null,
                repeat_occurrences: null,
            });
        });
    });
});
