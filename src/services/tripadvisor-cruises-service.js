const { get } = require('./tripadvisor-restful-service');
const { responseHandler } = require('../helpers/responses-handler/responses-handler');

const url = process.env.API_MAIN_URL + process.env.API_VERSION;
const cruisesEndpoint = '/cruises';
const cruisesUrl = url + cruisesEndpoint;

async function getAvailableCruises() {
    const endpoint = '/getLocation';
    const cruisesLocationsUrl = cruisesUrl + endpoint;

    const response = await get({ url: cruisesLocationsUrl });

    return responseHandler({ response });
}

async function searchCruisesByDestinationId({
    destinationId,
    order = 'popularity',
    page = 1,
    currencyCode = 'USD',
}) {
    const endpoint = '/searchCruises';
    const cruisesSearchUrl = cruisesUrl + endpoint;

    const response = await get({
        url: cruisesSearchUrl,
        queryParams: { destinationId, order, page, currencyCode },
    });

    return responseHandler({ response });
}

module.exports = {
    getAvailableCruises,
    searchCruisesByDestinationId,
};
