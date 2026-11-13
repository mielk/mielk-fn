# mielk-fn

Helper functions shared by mielk applications: arrays, objects, strings, numbers, dates, regular expressions,
type checks and a shared Redis client. The library is written in TypeScript and published to npm as an ES module
with type declarations.

## Requirements

- Node.js 24 or later (`engines.node: >=24`); development uses the version in `.nvmrc` (24.13.0).
- Optional peer dependency `redis` `^5`, only for the entry point `mielk-fn/redis`.
- ES modules: the package has no CommonJS build (`require` works only through dynamic `import()`).

## Installation

```bash
npm install mielk-fn
# only for mielk-fn/redis:
npm install mielk-fn redis
```

## Entry points

| Entry point          | Purpose                                                                                                 | Environments                   |
| -------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `mielk-fn`           | All modules below except `redis`, as flat named exports                                                 | Node.js, browser, React Native |
| `mielk-fn/arrays`    | `toMap`, `toIndexedArray`                                                                               | Node.js, browser, React Native |
| `mielk-fn/dates`     | `formatDateDefault` (time zone, default Europe/Warsaw)                                                  | Node.js, browser, React Native |
| `mielk-fn/io`        | `parseJsonFile` (content of a dynamically imported JSON module)                                         | Node.js, browser, React Native |
| `mielk-fn/math`      | `formatWithSign`, `formatPercent`                                                                       | Node.js, browser, React Native |
| `mielk-fn/objects`   | `invert`, `merge`, `modifyKeys`, `isNonEmptyObject`                                                     | Node.js, browser, React Native |
| `mielk-fn/regex`     | `getCapturedNumber`                                                                                     | Node.js, browser, React Native |
| `mielk-fn/strings`   | `capitalizeFirst`, `collapseWhitespace`                                                                 | Node.js, browser, React Native |
| `mielk-fn/types`     | Types `JSONFile`, `Range`, `ObjectPrimitives`, `DeepPartial`                                            | all (types only)               |
| `mielk-fn/variables` | `isObject`, `isPlainObject`, `isPrimitive`, `isStringOrNumber`, `isArrayOfPrimitives`, type `Primitive` | Node.js, browser, React Native |
| `mielk-fn/redis`     | `getRedisClient`, `addRedisKey`, `removeRedisKey`, type `RedisConfig`                                   | Node.js only                   |

Each function is documented with TSDoc in the source; editors show the description, parameters and errors.

## Usage

```ts
import { formatPercent, invert, toMap } from 'mielk-fn';

const byId = toMap(users, (user) => user.id);
const codes = invert({ pl: 'Polish', en: 'English' }); // { Polish: 'pl', English: 'en' }
formatPercent(0.1234, 1); // '12.3%'
```

```ts
import { addRedisKey, getRedisClient } from 'mielk-fn/redis';

// Configure the shared client once, at application start-up.
await getRedisClient({ host: 'redis.local', port: 6379, password: secret, onError: (error) => logger.error(error) });
await addRedisKey('session:42', { userId: 7 }, 3600);
```

## Configuration

The library reads no environment variables and no files; configuration is passed as parameters.
`getRedisClient(config)` takes `host` (default `127.0.0.1`), `port` (default `6379`), `password` and `onError`.
The first call creates the single client of the process; later calls may omit the configuration.

## Side effects

- Only `mielk-fn/redis` uses the network: it opens one connection to the Redis server on the first
  `getRedisClient` call, and `addRedisKey` / `removeRedisKey` write and delete keys on that server.
- No module writes to the console, to files or changes global state when imported (`sideEffects: false`).
- `formatDateDefault` keeps a cache of `Intl.DateTimeFormat` objects per time zone in memory.

## Errors

| Function                                          | Error                       | When                                                                                                                          |
| ------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `toIndexedArray`                                  | `TypeError`                 | the index callback returns a value that is not a number                                                                       |
| `formatWithSign`, `formatPercent`                 | `RangeError`                | `decimals` is less than 0 or greater than 100 (not for `NaN`)                                                                 |
| `formatDateDefault`                               | `RangeError`                | `timeZone` is not a valid time zone, or `date` is an invalid date                                                             |
| `getCapturedNumber`                               | `SyntaxError`               | `pattern` is a string that is not a valid regular expression                                                                  |
| `invert`                                          | `Error`                     | the input is not an object, a value is neither a string nor a number, or a value repeats and `ignoreDuplicatedKey` is `false` |
| `modifyKeys`                                      | `TypeError`                 | the input is not a plain object                                                                                               |
| `getRedisClient`                                  | `Error`                     | a later call passes a configuration different from the existing client                                                        |
| `getRedisClient`, `addRedisKey`, `removeRedisKey` | error of the `redis` client | the connection cannot be opened or a command fails                                                                            |
| `addRedisKey`                                     | `TypeError`                 | `content` cannot be serialised by `JSON.stringify` (circular reference, `bigint`); nothing is sent to Redis                   |

Other functions do not throw for documented inputs; type checks return `false` for unexpected values.

## Development

| Command                                   | Purpose                                                                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                  | install dependencies from `package-lock.json`                                                                               |
| `npm test`                                | all unit tests (Vitest) with coverage; threshold 80% of lines and branches; the report is written to the system temp folder |
| `npm run test:watch`                      | tests in watch mode                                                                                                         |
| `npm run typecheck`                       | TypeScript check without output                                                                                             |
| `npm run lint`                            | ESLint with type information, no warnings allowed                                                                           |
| `npm run format` / `npm run format:check` | Prettier                                                                                                                    |
| `npm run build`                           | compiles `src` to `dist` (clears the content of `dist`, keeps the folder)                                                   |
| `npm run check:package`                   | `publint --strict` and `attw` on the built package                                                                          |

`prepublishOnly` runs typecheck, lint, tests, build and the package check.
Unit tests do not connect to Redis: the `redis` module is replaced by a test double.

## Releases and changes

Changes are listed by hand in [CHANGELOG.md](CHANGELOG.md) under `Unreleased`; it also holds the migration notes
between major versions. `npm version <major|minor|patch>` moves the entries to the new version
(`scripts/release-changelog.ts`, run by Node.js directly) and creates the release commit and tag.

## Documentation scope

Deviation from the documentation standard (`doc:SCP-1`, `doc:SCP-4`), approved by the user on 2026-11-13
(TASK-188): the library has no generated user and technical documentation sites, API reference or agent
documentation (`doc/agent/CORE.md`), because no documentation generator for TypeScript exists yet. Until it does,
this README, the TSDoc comments of every export and [CHANGELOG.md](CHANGELOG.md) are the complete documentation.
The generator is planned as a separate task for all mielk libraries.

## License

[MIT](LICENSE)
