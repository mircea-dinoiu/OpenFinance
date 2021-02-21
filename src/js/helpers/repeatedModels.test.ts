import {RepeatOption} from 'js/defs';
import {advanceRepeatDate} from './repeatedModels';

describe('#advanceRepeatDate()', () => {
    describe('When repeat is twice monthly', () => {
        it('Should work', () => {
            expect(
                advanceRepeatDate({
                    created_at: '2019-05-03',
                    repeat: RepeatOption.MONTHLY_TWICE,
                }),
            ).toMatchInlineSnapshot(`"2019-05-03T07:00:00.000Z"`);
            expect(
                advanceRepeatDate({
                    created_at: '2019-02-15',
                    repeat: RepeatOption.MONTHLY_TWICE,
                }),
            ).toMatchInlineSnapshot(`"2019-02-15T08:00:00.000Z"`);
        });
    });
});
