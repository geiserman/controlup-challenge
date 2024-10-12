const { initialize } = require('@geiserman/js-logger');
const { getConfigParameter } = require('@geiserman/yaml-config-to-env');
const { getLogger } = require('@geiserman/js-logger');

const initializeLogger = () => {
    const logFileName = getConfigParameter('LOG_FILE_NAME');
    const logDir = getConfigParameter('LOGS_DIR');

    initialize({
        consoleConfig: {
            logFileFullPath: `${logDir}/${logFileName}`,
            isEnabled: getConfigParameter('LOGGER_CONSOLE_IS_ENABLED'),
            logLevel: getConfigParameter('LOGGER_CONSOLE_LEVEL'),
            // onlyJson: nodeEnv && nodeEnv !== 'test',
            onlyJson: false,
        },
    });
};

function getLoggerInternal() {
    initializeLogger();

    const logger = global.__LOGGER__ || getLogger();

    return logger;
}

module.exports = { initializeLogger, getLogger: getLoggerInternal };
