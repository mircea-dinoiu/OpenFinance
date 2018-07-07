import { modifiersToClassName } from './style';

describe('#modifiersToClassName()', () => {
    it('should work', () => {
        expect(
            modifiersToClassName(
                { ab: 'XYZ', ef: 'FOOBAR' },
                { ab: true, cd: false, ef: true },
            ),
        ).toEqual('XYZ FOOBAR');
    });
});
