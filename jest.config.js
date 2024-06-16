export default {
	roots: ['<rootDir>/tests'], // Specify the root directory for Jest to look for tests
	transform: {
		'^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files using ts-jest
	},
	testMatch: [
		'**/?(*.)+(spec|test).ts?(x)', // Match test files with .spec.ts or .test.ts extensions
	],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	reporters: [
		'default',
		[
			'jest-html-reporters',
			{
				publicPath: './reports/html-report',
				filename: 'report.html',
				pageTitle: 'My Project - Test Report',
				expand: true,
				openReport: true,
				groupBy: ['describe'],
			},
		],
	],
};
