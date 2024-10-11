// Get service environment.
const environment = process.env.NODE_ENV;

if (!environment) {
    throw new Error('process.env.NODE_ENV must be initialized');
}

const { initializeConfiguration } = require('@geiserman/yaml-config-to-env');
const { name: serviceName } = require('../package.json');
const { initializeLogger } = require('./init/initialize-logger');
const { getLogger } = require('./init/initialize-logger');

const logger = getLogger();

// Initialize prerequisites
initializeConfiguration({ environment });
initializeLogger({ serviceName });

process.on('unhandledRejection', async (error) => {
    try {
        // eslint-disable-next-line no-console
        console.error('FATAL-ERROR:unhandledRejection', error);
        logger.error('FATAL-ERROR:unhandledRejection', { errorMessage: error.message });
    } catch (e) {} // eslint-disable-line no-empty
});

process.on('uncaughtException', async (error) => {
    try {
        // eslint-disable-next-line no-console
        console.error('FATAL-ERROR:uncaughtException', error);
        logger.error('FATAL-ERROR:uncaughtException', { errorMessage: error.message });
    } finally {
        process.exit(1);
    }
});

logger.info(`Starting ${serviceName} to run on ${environment} environment`);
