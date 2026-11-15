// Package content check (npm:PAC-1): the package may contain only package.json, README.md, LICENSE,
// CHANGELOG.md and files from dist/ other than tests (*.spec.*) and source maps (*.map). The script reads
// the file list of `npm pack --dry-run --json` from standard input, prints the files that are not allowed
// and ends with exit code 1 when there are any. Run it after the build through `npm run check:package`.
// Node.js 24 runs this TypeScript file directly by stripping its types, so the file uses only erasable
// syntax and imports nothing but Node.js modules.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT_FILES = new Set(['package.json', 'README.md', 'LICENSE', 'CHANGELOG.md']);

/**
 * Tells whether a file may be part of the published package.
 *
 * @param path Path of the file inside the package, with forward slashes, e.g. `dist/index.js`.
 * @returns `true` for the allowed root files and for files from `dist/` that are not tests or source maps.
 */
export const isAllowedPackFile = (path: string): boolean => {
    if (ROOT_FILES.has(path)) return true;
    if (!path.startsWith('dist/')) return false;
    const name = path.slice(path.lastIndexOf('/') + 1);
    return !name.endsWith('.map') && !/\.spec\./.test(name);
};

/**
 * Returns the files of the package that are not allowed.
 *
 * @param packJson Output of `npm pack --dry-run --json`.
 * @returns Paths of the files that break npm:PAC-1, in the order of the output.
 * @throws {Error} When the output is not the JSON array printed by `npm pack --json`.
 */
export const disallowedPackFiles = (packJson: string): string[] => {
    const parsed: unknown = JSON.parse(packJson);
    if (!Array.isArray(parsed) || parsed.length !== 1) throw new Error('Expected the output of npm pack --json.');
    const files: unknown = (parsed[0] as { files?: unknown }).files;
    if (!Array.isArray(files)) throw new Error('The output of npm pack --json has no file list.');
    return files.map((file) => (file as { path: string }).path).filter((path) => !isAllowedPackFile(path));
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const disallowed = disallowedPackFiles(readFileSync(0, 'utf8'));
    if (disallowed.length > 0) {
        console.error(`Files not allowed in the package (npm:PAC-1):\n${disallowed.join('\n')}`);
        process.exit(1);
    }
    console.log('Package content: OK (npm:PAC-1).');
}
