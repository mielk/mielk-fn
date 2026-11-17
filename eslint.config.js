// ESLint flat config: the shared configuration of the mielk libraries (@mielk/lib-config, ts:LNT-1, ts:LNT-3).
import { mielkEslint } from '@mielk/lib-config/eslint';

export default mielkEslint({ rootDir: import.meta.dirname });
