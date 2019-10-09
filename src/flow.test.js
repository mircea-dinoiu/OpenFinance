import recursiveReaddir from 'recursive-readdir';
import path from 'path';
import fs from 'fs';

describe('All files in src', () => {
    it('should have flow annotation', (done) => {
        recursiveReaddir('./src', (err, files) => {
            expect(err).toBe(null);
            const failed = [];

            files.forEach((file) => {
                const parsed = path.parse(file);

                if (parsed.ext === '.js' && !parsed.name.endsWith('.test')) {
                    const passes = fs
                        .readFileSync(file, 'utf-8')
                        .startsWith('// @flow');

                    if (!passes) {
                        failed.push(file);
                    }
                }
            });

            expect(failed.join('\n')).toEqual('');

            done();
        });
    });
});
