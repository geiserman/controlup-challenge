const assert = require('assert');
const { FailuresReporter } = require('./failures-reporter');
const { MARKERS } = require('../constants');

describe(`FailuresReporter ${MARKERS.UNIT}`, () => {
    it('should be a singleton', () => {
        const reporter1 = new FailuresReporter();
        const reporter2 = new FailuresReporter();

        assert.strictEqual(reporter1, reporter2);
    });

    it('should add failures to the report', () => {
        const reporter = new FailuresReporter();

        reporter.addFailure('Test failure 1');
        reporter.addFailure('Test failure 2');
        assert.strictEqual(reporter.__getReport(), 'Test failure 1Test failure 2');
    });

    it('should return and erase the report', () => {
        const reporter = new FailuresReporter();

        reporter.eraseReport();
        reporter.addFailure('Test failure 1');
        assert.strictEqual(reporter.getReport(), 'Test failure 1');
        assert.strictEqual(reporter.__getReport(), null);
    });

    it('should erase the report', () => {
        const reporter = new FailuresReporter();

        reporter.addFailure('Test failure 1');
        reporter.eraseReport();
        assert.strictEqual(reporter.__getReport(), null);
    });
});
