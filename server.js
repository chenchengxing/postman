// var http = require('http');
// var server = http.createServer(function (req, res) {
//   var options = {
//     host: 'm.baidu.com',
//     path: '/',
//     method: 'GET',
//     headers: {
//         'Accept': 'text/html'
//     }
// };
//   var serverReq = http.request(options, function (serverRes) {
//         console.log(req.url + " " + serverRes.statusCode);
//         res.writeHead(serverRes.statusCode, serverRes.headers);
//         serverRes.on('data', function (chunk) {
//             res.write(chunk);
//         });
//         serverRes.on('end', function () {
//             res.end();
//         });
//     });
//   serverReq.on('error', function (e) {
//             console.error('problem with request: ' + e.message);
//         });

//         req.addListener('data', function (chunk) {
//             serverReq.write(chunk);
//         });

//         req.addListener('end', function () {
//             serverReq.end();
//         });
//   // res.write('hello');
//   // console.log('out put hello');
//   // res.end();
// });
// server.listen('1337');
// console.log('server.listening 1337');

var querystring = require('querystring');
var http = require('http');
var url = require('url');
var express = require('express')
var app = express()
app.use(express.static(__dirname + '/public'));
/**
{
  url: 'angularjs.cn',
  path: 'A003',
  port: 80
}
*/
app.get('/post', function (req, res) {
  
  var query = url.parse(req.url).query;
  // console.log(query);
  var query = querystring.parse(query);
  console.log(query);
  var options = {
    host: query.host,
    path: query.path,
    port: ~~query.port || 80,
    method: 'GET',
    headers: {
      'Accept': 'text/html'
    }
  };
  var body = '';
  var serverReq = http.request(options, function (serverRes) {
      console.log(req.url + " " + serverRes.statusCode);
      
      serverRes.on('data', function (chunk) {
        body += chunk;
        console.log('got %d bytes of data', chunk.length);
        // res.write(JSON.stringify({name: 1})); 
      });
      serverRes.on('end', function () {
        var chunkBody = JSON.stringify({
          body: body,
          name: 1
        });
        res.writeHead(serverRes.statusCode, {
          'Content-Type': 'application/json'
        });
        res.write(chunkBody);
        res.end();
      });
  });
  serverReq.on('error', function (e) {
    console.error('problem with request: ' + e.message);
  });

  req.addListener('data', function (chunk) {
    serverReq.write(chunk);
  });

  req.addListener('end', function () {

    serverReq.end();
  });
  // res.write('hello');
  // console.log('out put hello');
  // res.end();
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})