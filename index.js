const fetch = require('hyperquest');
const qs = require('querystring');
const UA = 'Tarik/' + require('./package.json').version;

const request = (options) => {
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

    const query = options.query || options.qs;
    options.uri = query ? (options.uri + '?' + qs.stringify(query)) : options.uri;

    return new Promise((resolve, reject) => {
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

const make = (method, uri, body, options) => {
    const query = options ? (options.query || options.qs) : null;
    const settings = {
        method,
        uri: query ? (uri + '?' + qs.stringify(query)) : uri,
    };

    if (body) {
        settings.body = body;
        settings.headers = {
            'Content-Type': (options && options.json) ? 'application/json' : 'application/x-www-form-urlencoded',
            'User-Agent': UA
        }

        if (options && options.headers) {
            fill(settings.headers, options.headers);
            delete options.headers;
        }
    }

    fill(settings, options);
    return request(settings);
}

const fill = (a, b) => {
    for (let k in b) {
        if (!a[k]) {
            a[k] = b[k];
        }
    }
}

request.post = (uri, body, options) => {
    return make('POST', uri, body, options);
};

request.patch = (uri, body, options) => {
    return make('PATCH', uri, body, options);
}

request.put = (uri, body, options) => {
    return make('PUT', uri, body, options);
}

request.get = (uri, options) => {
    return make('GET', uri, null, options);
}

request.delete = (uri, options) => {
    return make('DELETE', uri, null, options);
}

module.exports = request;
