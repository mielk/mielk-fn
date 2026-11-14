import { describe, expect, it } from 'vitest';
import * as root from './index.js';
import * as arrays from './arrays/index.js';
import * as dates from './dates/index.js';
import * as io from './io/index.js';
import * as math from './math/index.js';
import * as objects from './objects/index.js';
import * as regex from './regex/index.js';
import * as strings from './strings/index.js';
import * as variables from './variables/index.js';
import * as redis from './redis/index.js';

const subpathModules = { arrays, dates, io, math, objects, regex, strings, variables };

describe('main entry point', () => {
    it('exports every function of each environment-neutral subpath module under the same name', () => {
        for (const [moduleName, moduleExports] of Object.entries(subpathModules)) {
            for (const [name, value] of Object.entries(moduleExports)) {
                expect({ moduleName, name, same: (root as Record<string, unknown>)[name] === value }).toEqual({
                    moduleName,
                    name,
                    same: true,
                });
            }
        }
    });

    it('exports nothing besides the subpath modules', () => {
        const expected = new Set(Object.values(subpathModules).flatMap((moduleExports) => Object.keys(moduleExports)));
        expect(new Set(Object.keys(root))).toEqual(expected);
    });

    it('does not export the redis module', () => {
        for (const name of Object.keys(redis)) {
            expect(Object.keys(root)).not.toContain(name);
        }
    });

    it('does not export the former namespaces', () => {
        for (const name of ['dates', 'numbers', 'objects', 'strings', 'types', 'variables']) {
            expect(Object.keys(root)).not.toContain(name);
        }
    });
});
