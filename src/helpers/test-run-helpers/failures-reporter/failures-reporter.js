class FailuresReporter {
    constructor() {
        if (FailuresReporter._instance) {
            return FailuresReporter._instance;
        }

        this.report = '';

        FailuresReporter._instance = this;
    }

    __getReport() {
        if (this.report) {
            return this.report;
        }

        return null;
    }

    __addReport(message) {
        this.report = this.report.concat(message);
    }

    addFailure(message) {
        this.__addReport(message);
    }

    getReport() {
        const copyOfReport = this.__getReport();

        if (copyOfReport) {
            this.eraseReport();
        }

        return copyOfReport;
    }

    eraseReport() {
        this.report = '';
    }
}

module.exports = {
    FailuresReporter,
};
