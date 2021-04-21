import {formatCurrency} from 'app/formatters';

describe('#formatCurrency()', () => {
    it('Should work', () => {
        expect(formatCurrency(35004.63786082, 'USD')).toMatchInlineSnapshot(`"$35,004.63"`);
        expect(formatCurrency(35004, 'USD')).toMatchInlineSnapshot(`"$35,004.00"`);
    });
});
