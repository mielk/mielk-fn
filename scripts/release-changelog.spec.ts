import { describe, expect, it } from 'vitest';
import { releaseChangelog } from './release-changelog.js';

const HEADER = '# Changelog\n\nIntro.\n\n';
const OLD = '## [1.0.0] - 2026-01-01\n\n### Fixed\n\n- Old fix.\n';

describe('releaseChangelog', () => {
  it('moves the Unreleased entries to a section of the version and leaves Unreleased empty', () => {
    const changelog = `${HEADER}## [Unreleased]\n\n### Added\n\n- New thing (TASK-1).\n\n${OLD}`;
    expect(releaseChangelog(changelog, '1.1.0', '2026-11-13')).toBe(
      `${HEADER}## [Unreleased]\n\n## [1.1.0] - 2026-11-13\n\n### Added\n\n- New thing (TASK-1).\n\n${OLD}`,
    );
  });

  it('handles an Unreleased section that is the last section', () => {
    const changelog = `${HEADER}## [Unreleased]\n\n### Fixed\n\n- Fix.\n`;
    expect(releaseChangelog(changelog, '1.0.1', '2026-11-13')).toBe(
      `${HEADER}## [Unreleased]\n\n## [1.0.1] - 2026-11-13\n\n### Fixed\n\n- Fix.\n\n`,
    );
  });

  it('stops at a version heading of level three left by standard-version', () => {
    const legacy = '### [1.2.6](https://example.com) (2026-04-03)\n\n### Bug Fixes\n\n- Old fix.\n';
    const changelog = `${HEADER}## [Unreleased]\n\n### Fixed\n\n- Fix.\n\n${legacy}`;
    expect(releaseChangelog(changelog, '2.0.0', '2026-11-13')).toBe(
      `${HEADER}## [Unreleased]\n\n## [2.0.0] - 2026-11-13\n\n### Fixed\n\n- Fix.\n\n${legacy}`,
    );
  });

  it('throws when Unreleased has no entries', () => {
    const changelog = `${HEADER}## [Unreleased]\n\n### Added\n\n${OLD}`;
    expect(() => releaseChangelog(changelog, '1.1.0', '2026-11-13')).toThrow(/no entries/);
  });

  it('throws when there is no Unreleased section', () => {
    expect(() => releaseChangelog(`${HEADER}${OLD}`, '1.1.0', '2026-11-13')).toThrow(/no "## \[Unreleased\]"/);
  });

  it('throws when the version already has a section', () => {
    const changelog = `${HEADER}## [Unreleased]\n\n- Fix.\n\n${OLD}`;
    expect(() => releaseChangelog(changelog, '1.0.0', '2026-11-13')).toThrow(/already has a section/);
  });
});
