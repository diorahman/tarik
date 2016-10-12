const body = 'cpCustomerID=kayden75%40yahoo.com&apiUser=qpadmin&apiPassword=password1&apiuser=qpadmin&apipassword=password1&locale=eng&channelPartnerID=HAWK&ipAddress=103.14.76.160';
const uri = 'https://load-sg-rest.evergent.com/qp/searchAccount';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

const request = require('request-promise');
const get = request({
    method: 'POST',
    uri,
    headers,
    body
});

const promises = [];
for (let i = 0; i < 20000; i++) {
    promises.push(get);
}

Promise.all(promises)
    .then((results) => {
        console.log(results);
    });

