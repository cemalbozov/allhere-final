const Iyzipay = require('iyzipay');

var iyzipay = new Iyzipay({
    apiKey: 'sandbox-LYYf4Bvz0vQX79jQQURUYM8pYlOcuR2A',
    secretKey: 'sandbox-KS0IfxPnpnobdJWHhz4aAymzceVQ9mR1',
    uri: 'https://sandbox-api.iyzipay.com'
});

module.exports = iyzipay;