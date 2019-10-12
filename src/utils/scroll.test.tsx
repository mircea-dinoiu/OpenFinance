import {scrollIsAt, scrollReachedBottom} from 'src/utils/scroll';

describe('#scrollIsAt()', () => {
    it('should work properly', () => {
        expect(
            scrollIsAt(
                {
                    scrollTop: 0,
                    scrollHeight: 300,
                    clientHeight: 100,
                },
                0,
            ),
        ).toBe(true);

        expect(
            scrollIsAt(
                {
                    scrollTop: 200,
                    scrollHeight: 300,
                    clientHeight: 100,
                },
                100,
            ),
        ).toBe(true);

        expect(
            scrollIsAt(
                {
                    scrollTop: 100,
                    scrollHeight: 300,
                    clientHeight: 100,
                },
                50,
            ),
        ).toBe(true);
    });
});

describe('#scrollReachedBottom()', () => {
    it('should work properly', () => {
        expect(
            scrollReachedBottom({
                scrollTop: 100,
                scrollHeight: 300,
                clientHeight: 100,
            }),
        ).toBe(false);

        expect(
            scrollReachedBottom({
                scrollTop: 200,
                scrollHeight: 300,
                clientHeight: 100,
            }),
        ).toBe(true);
    });
});
