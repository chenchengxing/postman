// var http = require('http');
// var requestUrl = 'http://m.baidu.com';
// var options = {
//     path: requestUrl,
//     method: 'GET',
//     port: 80
//   };
//   var serverReq = http.request(options, function (serverRes) {
//         console.log(req.url + " " + serverRes.statusCode);
//         res.writeHead(serverRes.statusCode, serverRes.headers);
//         serverRes.on('data', function (chunk) {
//             console.log(chunk)
//         });
//         serverRes.on('end', function () {
//             res.end();
//         });
//     });
//   serverReq.on('error', function (e) {
//             console.error('problem with request: ' + e.message);
//         });

  var http = require('http');
var options = {
    host: 'm.baidu.com',
    path: '/',
    port: 80,
    method: 'GET',
    headers: {
        'Accept': 'text/html'
    }
};
console.log(options)
var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(data) {
        console.log(data);
    });
});
req.end();