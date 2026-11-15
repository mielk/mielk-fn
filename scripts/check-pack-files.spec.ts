import { describe, expect, it } from 'vitest';
import { disallowedPackFiles, isAllowedPackFile } from './check-pack-files.js';

const pack = (paths: string[]): string => JSON.stringify([{ files: paths.map((path) => ({ path })) }]);

describe('isAllowedPackFile', () => {
    it.each(['package.json', 'README.md', 'LICENSE', 'CHANGELOG.md', 'dist/index.js', 'dist/redis/index.d.ts'])(
        'allows %s',
        (path) => {
            expect(isAllowedPackFile(path)).toBe(true);
        },
    );

    it.each(['src/index.ts', 'dist/index.js.map', 'dist/arrays/index.spec.js', 'tsconfig.json', 'docs/README.md'])(
        'rejects %s',
        (path) => {
            expect(isAllowedPackFile(path)).toBe(false);
        },
    );
});

describe('disallowedPackFiles', () => {
    it('returns an empty list for a package with allowed files only', () => {
        expect(disallowedPackFiles(pack(['package.json', 'LICENSE', 'dist/index.js']))).toEqual([]);
    });

    it('returns the disallowed files in the order of the output', () => {
        expect(disallowedPackFiles(pack(['src/a.ts', 'dist/index.js', 'dist/index.js.map']))).toEqual([
            'src/a.ts',
            'dist/index.js.map',
        ]);
    });

    it('throws when the output is not a single-package array', () => {
        expect(() => disallowedPackFiles('{}')).toThrow('Expected the output of npm pack --json.');
        expect(() => disallowedPackFiles('[]')).toThrow('Expected the output of npm pack --json.');
    });

    it('throws when the package has no file list', () => {
        expect(() => disallowedPackFiles('[{}]')).toThrow('has no file list');
    });
});
