const fetch = require('hyperquest');

const request = (options) => {
    if (options.body) {
        options.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    return new Promise((resolve, reject) => {
        const r = fetch(options);
        if (options.body) {
            r.end(options.body);
        }

        let data = '';
        let result = {};

        r.on('error', reject);

        r.on('response', (response) => {
            result.statusCode = response.statusCode;
            result.headers = response.headers;
        });

        r.on('data', (chunk) => {
            // Buffer concat first then stringify?
            data += chunk;
        });

        r.on('end', () => {
            result.body = /json/.test(result.headers['content-type']) ? JSON.parse(data) : data;
            resolve(result);
        });
    });
}

module.exports = request;
