import { getDetachedItemUpdates } from 'mobile/ui/internal/common/MainScreenList';

describe('#getDetachedItemUpdates()', () => {
    it('should return item id + repeat null by default', () => {
        expect(getDetachedItemUpdates({ id: 300 })).toEqual({
            id: 300,
            repeat: null,
        });
    });

    describe('When repeat_occurrences is not null', () => {
        describe('When repeat_occurrences = 1', () => {
            it('should set it to null', () => {
                expect(
                    getDetachedItemUpdates({
                        id: 300,
                        repeat_occurrences: 1,
                    }),
                ).toEqual({ id: 300, repeat: null, repeat_occurrences: null });
            });
        });

        describe('When repeat_occurrences > 1', () => {
            it('should decrease it by 1', () => {
                expect(
                    getDetachedItemUpdates({
                        id: 300,
                        repeat_occurrences: 2,
                    }),
                ).toEqual({ id: 300, repeat: null, repeat_occurrences: 1 });
            });
        });
    });
});
