const environment = process.env.NODE_ENV || 'development';

require('jest-extended');

const { initializeConfiguration } = require('@geiserman/yaml-config-to-env');
const { name: serviceName } = require('./package.json');
const { initializeLogger, getLogger } = require('./src/init/initialize-logger');

jest.setTimeout(20000);

async function initialize() {
    try {
        initializeConfiguration({ environment });

        initializeLogger({ serviceName });

        const logger = getLogger();

        logger.debug('Initialization complete');
    } catch (error) {
        console.error('Initialization failed:', error);

        throw error;
    }
}

beforeAll(async () => {
    await initialize();
});
