const test = require('ava');
const request = require('../');

test('urlencoded', async t => {
    const payload = {
        cpCustomerID: 'kayden75@yahoo.com',
        apiuser: 'qpadmin',
        apipassword: 'password1',
        channelPartnerID: 'HAWK'
    };

    const uri = 'https://load-sg-rest.evergent.com/qp/searchAccount';
    const { statusCode, body, headers } = await request.post(uri, payload);
    t.deepEqual(statusCode, 200);
});

test('put', async t => {
    const payload = {
        cpCustomerID: 'kayden75@yahoo.com',
        apiuser: 'qpadmin',
        apipassword: 'password1',
        channelPartnerID: 'HAWK'
    };

    const uri = 'http://posttestserver.com/post.php?dump';
    const { statusCode, body, headers } = await request.put(uri, payload);
    t.deepEqual(statusCode, 200);
});

test('patch', async t => {
    const payload = {
        cpCustomerID: 'kayden75@yahoo.com',
        apiuser: 'qpadmin',
        apipassword: 'password1',
        channelPartnerID: 'HAWK'
    };

    const uri = 'http://posttestserver.com/post.php?dump';
    const { statusCode, body, headers } = await request.patch(uri, payload);
    t.deepEqual(statusCode, 200);
});

test('delete', async t => {
    const payload = {
        cpCustomerID: 'kayden75@yahoo.com',
        apiuser: 'qpadmin',
        apipassword: 'password1',
        channelPartnerID: 'HAWK',
        dump: 1
    };

    const uri = 'http://posttestserver.com/post.php?dump';
    const { statusCode, body, headers } = await request.delete(uri, payload);
    t.deepEqual(statusCode, 200);
});

test('json', async t => {
    const payload = {
        appServiceID: 'HOOQ_360days',
        cpCustomerID: 'kayden75@yahoo.com',
        paymentMethodInfo: {
            label: 'HAHA',
            transactionReferenceMsg: {
                amount: '123456',
                txID: '1234567',
                txMsg: 'Success'
            }
        },
        apiUser: 'qpadmin',
        apiPassword: 'password1',
        channelPartnerID: 'HOOQINDO'
    };

    const uri = 'http://posttestserver.com/post.php?dump';
    const { statusCode, body, headers } = await request.post(uri, payload, { json: true });
});

test('timeout', async t => {
    const payload = {
        appServiceID: 'HOOQ_360days',
        cpCustomerID: 'kayden75@yahoo.com',
        paymentMethodInfo: {
            label: 'HAHA',
            transactionReferenceMsg: {
                amount: '123456',
                txID: '1234567',
                txMsg: 'Success'
            }
        },
        apiUser: 'qpadmin',
        apiPassword: 'password1',
        channelPartnerID: 'HOOQINDO'
    };

    const uri = 'http://posttestserver.com/post.php?dump';
    try {
        const { statusCode, body, headers } = await request.post(uri, payload, { json: true, timeout: 5 });
    } catch (err) {
        t.deepEqual(err.code, 'ETIMEDOUT');
    }
});
