function mergeTestResults({ oldResults, newResults }) {
    const tmpOldResults = { ...oldResults };
    const tmpNewResults = { ...newResults };

    // if it's the first run, we can just return the results
    if (!tmpOldResults.testResults) {
        _filterOutPendingTests(tmpNewResults);

        return tmpNewResults;
    }

    // make a copy of the old results so we don't mutate the input
    const mergedResults = JSON.parse(JSON.stringify(tmpOldResults));

    // for each new result, input it in the old results alongside
    // the previous result for that test
    tmpNewResults.testResults.forEach((newResult) => {
        const oldResultIdx = mergedResults.testResults.findIndex(
            (result) => result.testFilePath === newResult.testFilePath,
        );

        const oldTestMeta = mergedResults.testResults[oldResultIdx];
        const newTestMeta = newResult;

        const numFailingTestsDelta = newTestMeta.numFailingTests - oldTestMeta.numFailingTests;

        const numPassingTestsDelta = newTestMeta.numPassingTests - oldTestMeta.numPassingTests;

        const numPendingTestsDelta = newTestMeta.numPendingTests - oldTestMeta.numPendingTests;

        const passedSuitesDelta = numFailingTestsDelta >= 0 ? 0 : 1;

        mergedResults.numFailedTests += numFailingTestsDelta;
        mergedResults.numPassedTests += numPassingTestsDelta;
        mergedResults.numPendingTests += numPendingTestsDelta;
        mergedResults.numPassedTestSuites += passedSuitesDelta;
        mergedResults.numFailedTestSuites =
            mergedResults.numFailedTestSuites >= 0
                ? mergedResults.numFailedTestSuites - passedSuitesDelta
                : mergedResults.numFailedTestSuites;

        mergedResults.testResults.splice(oldResultIdx, 1, newResult);
    });

    _filterOutPendingTests(mergedResults);

    return mergedResults;
}

function _filterOutPendingTests(actualResults) {
    const arrResultsIndexesToBeRemoved = [];

    for (const result of actualResults.testResults) {
        const arrTestResultsIndexesToBeRemoved = [];

        for (const testResult of result.testResults) {
            if (testResult.status === 'pending') {
                const index = result.testResults.indexOf(testResult);

                arrTestResultsIndexesToBeRemoved.push(index);
            }
        }

        for (const index of arrTestResultsIndexesToBeRemoved.reverse()) {
            result.testResults.splice(index, 1);
        }

        if (result.testResults.length === 0) {
            const index = actualResults.testResults.indexOf(result);

            arrResultsIndexesToBeRemoved.push(index);
        }
    }

    for (const index of arrResultsIndexesToBeRemoved.reverse()) {
        actualResults.testResults.splice(index, 1);
    }

    return actualResults;
}

module.exports = {
    mergeTestResults,
};
