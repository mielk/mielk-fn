export default {
	roots: ['<rootDir>/tests'], // Specify the root directory for Jest to look for tests
	transform: {
		'^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files using ts-jest
	},
	testMatch: [
		'**/?(*.)+(spec|test).ts?(x)', // Match test files with .spec.ts or .test.ts extensions
	],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // File extensions for modules
};
