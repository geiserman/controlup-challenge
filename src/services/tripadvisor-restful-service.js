const {
    get: pure_get,
    post: pure_post,
    del: pure_del,
    put: pure_put,
} = require('@geiserman/restful-client');

const tripAdvisorAutHeaders = {
    'x-rapidapi-key': process.env.API_KEY,
    'x-rapidapi-host': process.env.API_HOST,
};

async function get({ url, queryParams, customHeaders }) {
    if (!url) {
        throw new Error('url is required');
    }

    if (queryParams) {
        // check if queryParams is an object
        if (typeof queryParams !== 'object') {
            throw new Error('queryParams must be an object');
        }
    }

    if (customHeaders) {
        // check if customHeaders is an object
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

    return pure_get({
        url,
        queryParams,
        customHeaders: tmpCustomHeaders,
    });
}

module.exports = {
    get,
};
