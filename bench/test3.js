const http = require('http');
const hyper =  require('hyperquest');

const core = () => {
    var options = {
        hostname: 'posttestserver.com',
        port: 80,
        path: '/post.php?dump',
        method: 'DELETE',
        headers: {}
    };

    var req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    req.end();
}

const substack = () => {
    const r = hyper.delete('http://posttestserver.com/post.php?dump');
    console.log(r.request);
    r.on('data', (chunk) => {
        console.log(`SUBS: ${chunk}`);
    });

    r.on('end', () => {
        console.log('SUBS: No more data in response.');
    });

    r.on('error', (e) => {
        console.log(`SUBS: problem with request: ${e.message}`);
    });
}

core();
substack();
