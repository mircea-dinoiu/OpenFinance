import flattenObject from './flattenObject';

describe('#flattenObject()', () => {
    it('should work', () => {
        expect(
            flattenObject({
                a: 1,
                b: [1, 2],
                c: {
                    a: 1,
                    b: 2,
                },
            }),
        ).toEqual({
            a: 1,
            b: '[1,2]',
            'c.a': 1,
            'c.b': 2,
        });
    });
});
