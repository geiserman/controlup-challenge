const { get: pureGet } = require('@geiserman/restful-client');

const tripAdvisorAutHeaders = {
    'x-rapidapi-key': process.env.API_KEY,
    'x-rapidapi-host': process.env.API_HOST,
};

async function get({ url, queryParams, customHeaders }) {
    if (!url) {
        throw new Error('url is required');
    }

    if (queryParams) {
        if (typeof queryParams !== 'object') {
            throw new Error('queryParams must be an object');
        }
    }

    if (customHeaders) {
        if (typeof customHeaders !== 'object') {
            throw new Error('customHeaders must be an object');
        }
    }

    // join two objects customHeaders and tripAdvisorAutHeaders
    let tmpCustomHeaders;

    if (customHeaders) {
        tmpCustomHeaders = Object.assign(customHeaders, tripAdvisorAutHeaders);
    } else {
        tmpCustomHeaders = tripAdvisorAutHeaders;
    }

    return pureGet({
        url,
        queryParams,
        customHeaders: tmpCustomHeaders,
    });
}

module.exports = {
    get,
};
