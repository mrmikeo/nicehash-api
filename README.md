# Nicehash Api v2 Wrapper

```
const Nicehash 	= require('nicehash-api');

var nicehashkey = "x";
var nicehashpass = "x";
var nicehashorg = "x";

var niceh = new Nicehash(nicehashkey, nicehashpass, nicehashorg);

niceh.orderBook({algorithm:'SCRYPT', size:100, page:0}, function(err, response, body) {

  console.log(body);

})
```
