const fetch = require('hyperquest');
const qs = require('querystring');
const ua = 'Tarik/' + require('./package.json').version;

const request = (options = {}) => {
    options.headers = options.headers || {};
    if (options.body) {
        if (typeof options.body === 'object') {
            if (/json/.test(options.headers['Content-Type'])) {
                // FIXME: if it has scheme, use fast-json-stringify
                options.body = JSON.stringify(options.body);
            } else {
                options.body = qs.stringify(options.body);
            }
        }

        options.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    return new Promise((resolve, reject) => {
        options.headers['User-Agent'] = ua;
        const r = fetch(options);
        if (r.request.duplex) {
            r.end(options.body);
        }

        let data = '';
        let result = {};

        r.on('error', (err) => {
            return reject(r.timeout || err);
        });

        r.on('response', (response) => {
            result.statusCode = response.statusCode;
            result.headers = response.headers;
        });

        r.on('data', (chunk) => {
            // FIXME: benchmark - Buffer concat first then stringify?
            data += chunk;
        });

        r.on('end', () => {
            result.body = /json/.test(result.headers['content-type']) ? JSON.parse(data) : data;
            resolve(result);
        });
    });
}

request.post = (uri, body, options = {}) => {
    const settings = {
        method: 'POST',
        uri,
        body,
        headers: {
            'Content-Type': options.json ? 'application/json' : 'application/x-www-form-urlencoded'
        }
    };
    fill(options, settings);
    return request(settings);
};

request.patch = (uri, body, options = {}) => {
    const settings = {
        method: 'PATCH',
        uri,
        body,
        headers: {
            'Content-Type': options.json ? 'application/json' : 'application/x-www-form-urlencoded'
        }
    };
    fill(settings, options);
    return request(settings);
}

request.put = (uri, body, options = {}) => {
    const settings = {
        method: 'PUT',
        uri,
        body,
        headers: {
            'Content-Type': options.json ? 'application/json' : 'application/x-www-form-urlencoded'
        }
    };
    fill(settings, options);
    return request(settings);
}

request.get = (uri, query, options = {}) => {
    const settings = {
        method: 'GET',
        uri: query ? uri + '?' + qs.stringify(query) : uri,
    };
    fill(settings, options);
    return request(settings);
}

request['delete'] = (uri, query, options = {}) => {
    const settings = {
        method: 'DELETE',
        uri: query ? uri + '?' + qs.stringify(query) : uri,
    };
    fill(options, settings);
    return request(settings);
}

const fill = (a, b) => {
    for (let k in a) {
        if (!b[k]) {
            b[k] = a[k];
        }
    }
}

module.exports = request;
