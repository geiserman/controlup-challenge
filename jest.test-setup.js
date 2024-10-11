const environment = process.env.NODE_ENV;

/* eslint-disable import/order */
require('jest-extended');

const { getLogger } = require('./src/init/initialize-logger');

const { name: serviceName } = require('./package.json');
const { initializeConfiguration } = require('@geiserman/yaml-config-to-env');
const { initializeLogger } = require('./src/init/initialize-logger');

let logger = getLogger();

jest.setTimeout(400000);
initialize();
// setGlobals();

beforeAll(async () => {
    logger.debug('beforeall');
});

function initialize() {
    // Initialize prerequisites
    initializeConfiguration({ environment });
    initializeLogger({ serviceName });
    logger = getLogger();
}
