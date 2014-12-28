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
var urlParser = require('url');
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request');

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

app.post('/makeRequest', function(req, res) {
  var url = req.body.url;
  var method = req.body.method;
  var params = req.body.params;
  var headers = req.body.headers;
  var query = urlParser.parse(url);

  // console.log(query, url, method, params, headers);
  var options = {
    host: query.hostname,
    path: query.path,
    port: ~~query.port || 80,
    method: method,
    headers: {
        'Accept': 'text/html'
    }
  };

  request({
    url: url

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body) // Print the google web page.
      res.write(JSON.stringify({
        body: body
      }));
      res.end();
    }
  });
  // var responseBody = '';
  // console.log(options);
  // var makeRequest = http.request(options, function (makeResponse) {
  //   makeResponse.on('data', function (chunk) {
  //     console.log('got %d bytes of data', chunk.length);
  //     responseBody += chunk;
  //   });
  //   makeResponse.on('end', function () {
  //     res.writeHead(makeResponse.statusCode, makeResponse.headers);
  //     res.write(responseBody);
  //     res.end();
  //   });
  // });
  // //write to request making when there's any
  // req.addListener('data', function (chunk) {
  //   makeRequest.write(chunk);
  // });
  // req.addListener('end', function () {
  //   makeRequest.end();
  // });
  // makeRequest.on('error', function (e) {
  //   console.error('problem with request: ' + e.message);
  // });
});
/**
{
  url: 'angularjs.cn',
  path: 'A003',
  port: 80
}
*/
app.get('/post', function (req, res) {
  
  var query = urlParser.parse(req.url).query;
  // console.log(query);
  var query = querystring.parse(query);
  console.log(query);
  var options = {
    host: query.url,
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
        res.writeHead(serverRes.statusCode, serverRes.headers);
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

