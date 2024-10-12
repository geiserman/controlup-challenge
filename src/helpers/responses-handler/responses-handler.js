async function responseHandler({ response }) {
    const { statusCode, body } = response;

    // for some reason there are cases when the api returns kinda error but wrapped in 200 status code
    // example: {
    //     "status": false,
    //     "timestamp": 1728693439583,
    //     "message": "Something went wrong. We have logged the error and will get the resolution."
    // }

    if (statusCode !== 200) {
        throw new Error(
            `HTTP error! status code: ${statusCode}, message: ${
                response.message || response.error
            }`,
        );
    }

    if (!body || typeof body !== 'object') {
        throw new Error('Invalid response body format!');
    }

    if (body.status === false) {
        throw new Error(`API error! message: ${body.message || 'Unknown error'}`);
    }

    return body.data;
}

module.exports = {
    responseHandler,
};
