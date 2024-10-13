const { runCLI } = require('@jest/core');
const { initializeConfiguration } = require('@geiserman/yaml-config-to-env');
const { getLogger } = require('@geiserman/js-logger');
const MyCustomReporter = require('jest-html-reporters');
const JestJUnit = require('jest-junit');
const path = require('path');
const { getDateAndTime } = require('./src/helpers/date-time-helpers');
const { initializeLogger } = require('./src/init/initialize-logger');
const { mergeTestResults } = require('./src/helpers/test-run-helpers/merge-results');

const environment = process.env.NODE_ENV || 'test';
const NUM_RETRIES = process.env.TEST_RUN_RETRIES || 3;

initializeConfiguration({ environment });
initializeLogger();

const logger = getLogger();

async function generateReport(results, globalConfig) {
    const reporter = new MyCustomReporter(globalConfig, {
        publicPath: process.env.REPORT_PATH,
        filename: `${environment}-${process.env.REPORT_NAME}-report.html`,
        pageTitle: `${environment.toUpperCase()} ${process.env.REPORT_NAME} ${getDateAndTime()}`,
    });

    await reporter.onRunComplete(null, results);

    const junit = new JestJUnit(globalConfig, {
        outputDirectory: `./${process.env.REPORT_PATH}`,
        outputName: `${environment}-${process.env.REPORT_NAME}-report.xml`,
    });

    junit.onRunComplete(null, results);
}

async function runTestsAndRetry({ jestConfig, retriesRemaining, mergedResults }) {
    try {
        logger.debug(`Running tests. Retries remaining: ${retriesRemaining}`);

        const tmpJestConfig = { ...jestConfig };
        const cliResponse = await runCLI(tmpJestConfig, tmpJestConfig.projects);

        const results = cliResponse?.results;
        const globalConfig = cliResponse?.globalConfig;

        if (!results) {
            logger.error('runCLI did not return any results');

            throw new Error('No test results returned from runCLI');
        }

        const tmpMergedResults = mergeTestResults({
            oldResults: mergedResults,
            newResults: results,
        });

        await generateReport(tmpMergedResults, globalConfig);

        if (!results.numFailedTests && !results.numFailedTestSuites) {
            logger.info('All tests passed successfully.');

            return Promise.resolve();
        }

        if (retriesRemaining <= 1) {
            logger.error('Out of retries. Some tests are still failing.');

            return Promise.reject(new Error('Out of retries. Some tests are still failing.'));
        }

        const failedTestFiles = results.testResults
            .filter((testResult) => testResult.numFailingTests > 0 || testResult.failureMessage)
            .map((testResult) => testResult.testFilePath);

        const updatedJestConfig = {
            ...jestConfig,
            testMatch: failedTestFiles,
        };

        logger.info(
            `Retrying failed tests (${failedTestFiles.length} files). ${
                retriesRemaining - 1
            } retries left.`,
        );

        return runTestsAndRetry({
            jestConfig: updatedJestConfig,
            retriesRemaining: retriesRemaining - 1,
            mergedResults: tmpMergedResults,
        });
    } catch (error) {
        logger.error('Error during test run:', error);

        throw error;
    }
}

(async () => {
    const rootDir = path.join(__dirname);
    const jestOptions = {
        verbose: true,
        config: `${rootDir}/jest.config.js`,
        projects: [`${rootDir}`],
        runInBand: true,
        testNamePattern: process.env.TEST_MARK,
    };

    logger.debug('Starting test suite with retries');
    await runTestsAndRetry({
        jestConfig: jestOptions,
        retriesRemaining: NUM_RETRIES,
        mergedResults: {},
    });
})();
