import {RepeatOption} from 'js/defs';
import {advanceRepeatDate} from './repeatedModels';

xdescribe('#advanceRepeatDate()', () => {
    describe('When repeat is twice monthly', () => {
        it('Should work', () => {
            expect(
                advanceRepeatDate(
                    {
                        created_at: '2019-05-03',
                        repeat: RepeatOption.DAY,
                    },
                    1,
                ),
            ).toMatchInlineSnapshot(`"2019-05-04T07:00:00.000Z"`);
            expect(
                advanceRepeatDate(
                    {
                        created_at: '2019-05-03',
                        repeat: RepeatOption.DAY,
                    },
                    2,
                ),
            ).toMatchInlineSnapshot(`"2019-05-05T07:00:00.000Z"`);
            expect(
                advanceRepeatDate(
                    {
                        created_at: '2019-05-03',
                        repeat: RepeatOption.DAY,
                    },
                    3,
                ),
            ).toMatchInlineSnapshot(`"2019-05-06T07:00:00.000Z"`);
        });
    });
});
