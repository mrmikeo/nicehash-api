const request = require('request')
const chance = require('chance').Chance()
const crypto = require('crypto')
const qs = require('querystring')

class Nicehash {
  constructor (apikey, apiSecret, organizationId) {
    this.apikey = apikey
    this.apiSecret = apiSecret
    this.organizationId = organizationId


  }

  request (method, path, query, body, cb) {
    let headers = {
      'X-Request-Id': +Date.now(),
      'X-Time': +Date.now(),
      'X-Nonce': chance.guid()
    }

    query = qs.stringify(query)

    let input = [
      this.apikey,
      headers['X-Time'].toString(),
      headers['X-Nonce'],
      null,
      this.organizationId,
      null,
      method.toUpperCase(),
      path,
      query
    ]

    if (body) {
      input.push(JSON.stringify(body))
    }

    headers['X-Auth'] = `${this.apikey}:${this.hmacSha256BySegments(input)}`

console.log(`https://api2.nicehash.com${path}${query ? '?' : ''}${query}`);
console.log(body);
console.log(method);
console.log(headers);
    
    request({
      url: `https://api2.nicehash.com${path}${query ? '?' : ''}${query}`,
      body,
      method,
      headers,
      json: true
    }, cb)
  }

  hmacSha256BySegments (input) {
    let signature = crypto.createHmac('sha256', this.apiSecret)

    for (let index in input) {
      if (+index) {
        signature.update(Buffer.from([0]))
      }

      if (input[index] !== null) {
        signature.update(Buffer.from(input[index]))
      }
    }

    return signature.digest('hex')
  }

  orderBook (query, cb) {
    this.request('GET', '/main/api/v2/hashpower/orderBook/', query, undefined, cb)
  }

  myOrderBook (query, cb) {
    this.request('GET', '/main/api/v2/hashpower/myOrders', query, undefined, cb)
  }

  createOrder (body, cb) {
    this.request('POST', '/main/api/v2/hashpower/order', {}, body, cb)
  }

  getOrder (orderId, cb) {
    this.request('GET', `/main/api/v2/hashpower/order/${orderId}`, {}, undefined, cb)
  }

  deleteOrder (orderId, cb) {
    this.request('DELETE', `/main/api/v2/hashpower/order/${orderId}`, {}, undefined, cb)
  }

  refillOrder (orderId, body, cb) {
    this.request('POST', `/main/api/v2/hashpower/order/${orderId}/refill`, body, undefined, cb)
  }

  updateOrderPriceAndLimit (orderId, body, cb) {
    this.request('POST', `/main/api/v2/hashpower/order/${orderId}/updatePriceAndLimit`, {}, body, cb)
  }

  getPools (price, size, cb) {
    this.request('GET', '/main/api/v2/pools', { price, size }, null, cb)
  }

  createPool (body, cb) {
    this.request('POST', '/main/api/v2/pool', {}, body, cb)
  }

  getStats (orderId, cb) {
    this.request('GET', `/main/api/v2/hashpower/order/${orderId}/stats`, {}, undefined, cb)
  }
}

module.exports = Nicehash
