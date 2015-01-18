var querystring = require('querystring');
var http = require('http');
var urlParser = require('url');
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request');

var app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

app.post('/makeRequest', function(req, resp) {
  var url = req.body.url;
  var method = req.body.method;
  var headers = req.body.headers;
  var postData = req.body.postData;
  console.log(req.body)
  var logError = function (err) {
    console.log(err);
    // resp.writeHead(200, {
    //   'Content-Type': 'application/json'
    // });
    // resp.write(JSON.stringify({
    //   code: 500,
    //   message: 'postman server error'
    // }))
    resp.write(err.toString())
    resp.end();
  }
  try {
    if (method === 'GET') {
      request.get({
        url: url,
        headers: headers
      }).on('error', logError).pipe(resp);
    } else {
      // console.log('post')
      request({
        method: 'POST',
        url: url,
        headers: headers,
        body: postData
      }).on('error', logError).pipe(resp);
    }
  } catch (err) {
    logError(err)
  }
  // var method = req.body.method;
  // var params = req.body.params;
  // var headers = req.body.headers;
  // var query = urlParser.parse(url);

  // // console.log(query, url, method, params, headers);
  // var options = {
  //   host: query.hostname,
  //   path: query.path,
  //   port: ~~query.port || 80,
  //   method: method,
  //   headers: {
  //       'Accept': 'text/html'
  //   }
  // };

  // request({
  //   url: url
  // }, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log(response.headers)
  //     // if (response.headers['content-type'].indexOf('text/html') !== -1) 
  //     // console.log(body) // Print the google web page.

  //     res.write(JSON.stringify({
  //       body: body,
  //       headers: response.headers
  //     }));
  //     res.end();
  //   }
  // });
});

app.get('/fake', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.write(JSON.stringify({
      code: 200,
      data: true,
      message: 'get ok'
    }))
    // res.write('{\"code\":300,"data":true,"message":"get ok"');
  res.end();
})

app.post('/fake', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.write(JSON.stringify({
    code: 200,
    data: true,
    message: 'post ok'
  }))
  res.end();
})