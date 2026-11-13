// Version lifecycle script of `npm version` (npm:WYD-1, npm:CHG-1, npm:CHG-2): moves the entries of
// `## [Unreleased]` in CHANGELOG.md to a new section `## [<version>] - <YYYY-MM-DD>` right below it.
// npm sets npm_package_version to the new version before it runs the script; the `version` script
// then adds CHANGELOG.md to the release commit.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const UNRELEASED = '## [Unreleased]';

/**
 * Returns the changelog with the Unreleased entries moved to a section of the given version.
 *
 * @param {string} changelog Content of CHANGELOG.md.
 * @param {string} version The released version, e.g. `2.0.0`.
 * @param {string} date Release date as `YYYY-MM-DD`.
 * @returns {string} The new content; Unreleased stays as an empty section on top.
 * @throws {Error} When there is no Unreleased section, it has no entry, or the version is already listed.
 */
export const releaseChangelog = (changelog, version, date) => {
  const start = changelog.indexOf(UNRELEASED);
  if (start === -1) throw new Error(`CHANGELOG.md has no "${UNRELEASED}" section.`);
  if (changelog.includes(`## [${version}]`)) throw new Error(`CHANGELOG.md already has a section for ${version}.`);
  const bodyStart = start + UNRELEASED.length;
  // A version heading ends the section; versions released with standard-version use '### [x.y.z]'.
  const next = changelog.slice(bodyStart).search(/\n#{2,3} \[/);
  const bodyEnd = next === -1 ? changelog.length : bodyStart + next + 1;
  const body = changelog.slice(bodyStart, bodyEnd);
  if (!/^- /m.test(body)) throw new Error(`"${UNRELEASED}" has no entries; a version without changes is not released.`);
  const entries = body.trim();
  return `${changelog.slice(0, bodyStart)}\n\n## [${version}] - ${date}\n\n${entries}\n\n${changelog.slice(bodyEnd)}`;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const version = process.env.npm_package_version;
  if (!version) throw new Error('npm_package_version is not set; run this script through npm version.');
  const date = new Date().toISOString().slice(0, 10);
  const changelog = readFileSync('CHANGELOG.md', 'utf8');
  writeFileSync('CHANGELOG.md', releaseChangelog(changelog, version, date));
}
