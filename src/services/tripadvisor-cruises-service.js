const { get } = require('./tripadvisor-restful-service');
const { responseHandler } = require('../helpers/responses-handler/responses-handler');
const { getLogger } = require('../init/initialize-logger');

const baseUrl = `${process.env.API_MAIN_URL}${process.env.API_VERSION}`;
const cruisesEndpoint = '/cruises';
const cruisesUrl = `${baseUrl}${cruisesEndpoint}`;

const logger = getLogger();

function constructUrl(endpoint) {
    return `${cruisesUrl}${endpoint}`;
}

async function getCruiseLocations() {
    const endpoint = '/getLocation';
    const cruisesLocationsUrl = constructUrl(endpoint);

    try {
        const response = await get({ url: cruisesLocationsUrl });

        return responseHandler({ response });
    } catch (error) {
        logger.error(`Failed to fetch cruise locations: ${error.message}`);

        throw new Error('Failed to fetch cruise locations');
    }
}

async function searchCruisesByDestinationId({
    destinationId,
    order = 'popularity',
    page = 1,
    currencyCode = 'USD',
}) {
    if (!destinationId) {
        throw new Error('destinationId is required to search for cruises');
    }

    const endpoint = '/searchCruises';
    const cruisesSearchUrl = constructUrl(endpoint);

    try {
        const response = await get({
            url: cruisesSearchUrl,
            queryParams: { destinationId, order, page, currencyCode },
        });

        return responseHandler({ response });
    } catch (error) {
        logger.error(
            `Failed to search cruises for destinationId ${destinationId}: ${error.message}`,
        );

        throw new Error('Error searching cruises by destination');
    }
}

module.exports = {
    getCruiseLocations,
    searchCruisesByDestinationId,
};
