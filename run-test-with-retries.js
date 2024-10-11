// run_tests_with_retries.js
const { runCLI } = require('@jest/core');
const { initializeConfiguration } = require('@geiserman/yaml-config-to-env');
const { getLogger } = require('@geiserman/js-logger');
const MyCustomReporter = require('jest-html-reporters');
const path = require('path');
const JestJUnit = require('jest-junit');
const { getDateAndTime } = require('./src/helpers/date-time-helpers');
const { initializeLogger } = require('./src/init/initialize-logger');
const { mergeTestResults } = require('./src/helpers/test-run-helpers/merge-results');

const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'test';

initializeConfiguration({ environment });

initializeLogger();

const logger = global.__LOGGER__ || getLogger();

global.__LOGGER__ = logger;

const NUM_RETRIES = process.env.TEST_RUN_RETRIES || 3;

// eslint-disable-next-line consistent-return
async function runTestsAndRetry({ jestConfig, retriesRemaining, mergedResults }) {
    try {
        let retries = retriesRemaining;
        const tmpJestConfig = { ...jestConfig };
        const { results, globalConfig } = await runCLI(tmpJestConfig, tmpJestConfig.projects);

        const tmpMergedResults = mergeTestResults({
            oldResults: mergedResults,
            newResults: results,
        });

        const reporter = new MyCustomReporter(globalConfig, {
            publicPath: process.env.REPORT_PATH,
            filename: `${process.env.NODE_ENV.toLowerCase()}-${
                process.env.REPORT_NAME
            }-report.html`,
            pageTitle: `${process.env.NODE_ENV.toUpperCase()} ${
                process.env.REPORT_NAME
            } ${getDateAndTime()}`,
        });

        await reporter.onRunComplete(null, tmpMergedResults);

        const junit = new JestJUnit(globalConfig, {
            outputDirectory: `./${process.env.REPORT_PATH}`,
            outputName: `${process.env.NODE_ENV.toLowerCase()}-${
                process.env.REPORT_NAME
            }-report.xml`,
        });

        junit.onRunComplete(null, tmpMergedResults);

        // If there were no failures or we're out of retries, return
        if (!results.numFailedTests && !results.numFailedTestSuites) {
            return Promise.resolve();
        }

        if (retriesRemaining === 1) {
            return Promise.reject(new Error('Out of retries. Some tests are still failing.'));
        }

        // Compile a list of the test suites that failed and tell Jest to only run those files next time
        tmpJestConfig.testMatch = results.testResults
            .filter((testResult) => testResult.numFailingTests > 0 || testResult.failureMessage)
            .map((testResult) => testResult.testFilePath);

        // Decrement retries remaining and retry
        retries -= 1;

        logger.debug(`Retrying failed tests. ${retriesRemaining} attempts remaining.`);

        return runTestsAndRetry({
            jestConfig: tmpJestConfig,
            retriesRemaining: retries,
            mergedResults: tmpMergedResults,
        });
    } catch (e) {
        logger.error('Error: ', e);

        throw new Error(e);
    }
}

(async () => {
    logger.debug('runTestsAndRetry()');

    const rootDir = path.join(__dirname);

    const jestOptions = {
        verbose: true,
        config: `${rootDir}/jest.config.js`,
        projects: [`${rootDir}`],
        runInBand: true,
        testNamePattern: process.env.TEST_MARK,
    };

    await runTestsAndRetry({
        jestConfig: jestOptions,
        retriesRemaining: NUM_RETRIES,
        mergedResults: {},
    });
})();
