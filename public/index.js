angular.module('app', ['ngMaterial', 'ngAnimate' /*, 'ui.codemirror'*/ ])
  .controller('AppCtrl', function($scope, $timeout, $mdSidenav) {
    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle();
    };
    $scope.toggleRight = function() {
      $mdSidenav('right').toggle();
    };
  })
  .controller('LeftCtrl', function($scope, $timeout, $mdSidenav) {
    $scope.histories = [{
      url: 'http://baidu.com'
    }]
    $scope.close = function() {
      $mdSidenav('left').close();
    };
  })
  .controller('RightCtrl', function($scope, $timeout, $mdSidenav, $http, $mdToast) {
    $scope.urlKeyUp = function($event) {
      if ($event.which === 13) {
        $scope.send();
      }
    }
    $scope.q = {
      commonHeaders: [{
        name: 'application/json',
        cate: 'Content-Type'
      }, {
        name: 'text/html',
        cate: 'Content-Type'
      }, {
        name: 'JSESSIONID=',
        cate: 'Cookie'
      }]
    };
    $scope.$watch('q.headerToAdd', function(newValue) {
      if (newValue) {
        $scope.request.headers.splice($scope.request.headers.length - 1, 0, {
          key: newValue.cate,
          value: newValue.name
        });
        $scope.q.headerToAdd = null;
      }
    })
    $scope.removeHeader = function(index) {
      $scope.request.headers.splice(index, 1)
    };
    $scope.removeParam = function(index) {
      $scope.request.params.splice(index, 1)
    };
    var lastOneFill = function(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        if (newValue[newValue.length - 1].key || newValue[newValue.length - 1].value) {
          newValue.push({});
        }
      }
    };
    // var generateQueryString = function(params) {
    //   var result = [];
    //   for (var i = 0; i < params.length; i++) {
    //     var item = '';
    //     if (params[i].key) {
    //       item = params[i].key + '=';
    //     }
    //     if (item && params[i].value) {
    //       item = item + params[i].value;
    //     }
    //     if (item) {
    //       result.push(item);
    //     }
    //   }
    //   return result.join('&');
    // };
    // $scope.$watch('request.params', function(newValue, oldValue) {
    //   lastOneFill(newValue, oldValue);
    //   if (newValue && newValue !== oldValue) {
    //     var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
    //     var url = $scope.request.url.replace(parse_url, function(match, capture) {
    //       var capture = [].slice.call(arguments, 0);
    //       var url = '';
    //       if (capture[1] && capture[2]) {
    //         url += capture[1] + ':' + capture[2]; // http://
    //       }
    //       url += capture[3]; // http://www.baidu.com
    //       if (capture[4]) {
    //         url += ':' + capture[4]; //http://www.baidu.com:80
    //       }
    //       if (capture[5]) {
    //         url += '/' + capture[5]; //http://www.baidu.com/path/path
    //       }
    //       if (generateQueryString(newValue)) {
    //         url += '?' + generateQueryString(newValue); // http://www.baidu.com/path?pa=1
    //       }
    //       if (capture[7]) {
    //         url += '#' + capture[7];
    //       }
    //       return url;
    //     });
    //     $scope.request.url = url;
    //   }
    // }, true);
    $scope.$watch('request.headers', lastOneFill, true);
    $scope.request = {
      // params: [{}],
      headers: [{}],
      // url: 'm.baidu.com',
      // url: 'http://waimai.baidu.com/waimai/shoplist/65acf4b82b63a535&display=json&taste=0?page=2&count=2',
      method: 'GET',
      postData: ''
    };
    $scope.postResult = {};
    $scope.send = function() {
      if (!$scope.request.url) return;
      var requestOptions = angular.copy($scope.request);
      //automatically add http protocol if not defined
      if (!/^[\w]{1,4}:\/\//.test(requestOptions.url)) {
        requestOptions.url = 'http://' + requestOptions.url;
      }

      //filter uncompleted header
      var headers = {};
      for (var i = 0; i < requestOptions.headers.length; i++) {
        if (requestOptions.headers[i].key && requestOptions.headers[i].value) {
          headers[requestOptions.headers[i].key] = requestOptions.headers[i].value;
        }
      }
      requestOptions.headers = headers;
      $scope.postResult = {};
      //make request now!
      $http.post('makeRequest', angular.toJson(requestOptions)).success(function(data, status, headers, config) {
        console.log(data);
        var HTML_HEADER_REG = /text\/html|text\/plain/;
        var JSON_HEADER_REG = /application\/json|application\/javascript/;
        headers = headers();
        $scope.postResult.raw = data;
        // beautify response due to different content type 
        if (HTML_HEADER_REG.test(headers['content-type'])) {
          console.log('text/html');
          $scope.postResult.body = vkbeautify.xml(data, 2);
        } else if (JSON_HEADER_REG.test(headers['content-type'])) {
          $scope.postResult.body = vkbeautify.json(data, 2);
          console.log('application/json');
        }
        $mdToast.show({
          controller: 'ToastCtrl',
          templateUrl: 'toast-template.html',
          hideDelay: 0,
          position: 'right',
          resolve: {
            postStatus: function () {
              return status;
            }
          }
        });
      }).error(function(data, status) {
        $scope.postResult.error = data;
        $mdToast.show({
          controller: 'ToastCtrl',
          templateUrl: 'toast-template.html',
          hideDelay: 0,
          position: 'right',
          resolve: {
            postStatus: function () {
              return status;
            }
          }
        });
      })
    };
  })
  .controller('ToastCtrl', function($scope, $mdToast, postStatus) {
    $scope.status = postStatus;
    $scope.closeToast = function() {
      $mdToast.hide();
    };
  })
  .filter('Status', function () {
    return function (input) {
      var map = {
        100:' Continue                       ',
        101:' Switching Protocols            ',
        102:' Processing                     ',
        200:' OK                             ',
        201:' Created                        ',
        202:' Accepted                       ',
        203:' Non-Authoritative Information  ',
        204:' No Content                     ',
        205:' Reset Content                  ',
        206:' Partial Content                ',
        207:' Multi-Status                   ',
        226:' IM Used                        ',
        300:' Multiple Choices               ',
        301:' Moved Permanently              ',
        302:' Found                          ',
        303:' See Other                      ',
        304:' Not Modified                   ',
        305:' Use Proxy                      ',
        307:' Temporary Redirect             ',
        400:' Bad Request                    ',
        401:' Unauthorized                   ',
        402:' Payment Required               ',
        403:' Forbidden                      ',
        404:' Not Found                      ',
        405:' Method Not Allowed             ',
        406:' Not Acceptable                 ',
        407:' Proxy Authentication Required  ',
        408:' Request Timeout                ',
        409:' Conflict                       ',
        410:' Gone                           ',
        411:' Length Required                ',
        412:' Precondition Failed            ',
        413:' Request Entity Too Large       ',
        414:' Request-URI Too Long           ',
        415:' Unsupported Media Type         ',
        416:' Requested Range Not Satisfiable',
        417:' Expectation Failed             ',
        422:' Unprocessable Entity           ',
        423:' Locked                         ',
        424:' Failed Dependency              ',
        426:' Upgrade Required               ',
        500:' Server Error'
      }

      return map[input] || '';
      
    }
  })
  .directive('codeMirror', ['$timeout', function($timeout) {
    return {
      scope: {
        ngModel: '='
      },
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        // Override the ngModelController $render method, which is what gets called when the model is updated.
        // This takes care of the synchronizing the codeMirror element with the underlying model, in the case that it is changed by something else.
        ngModel.$render = function() {
          //Code mirror expects a string so make sure it gets one
          //Although the formatter have already done this, it can be possible that another formatter returns undefined (for example the required directive)
          var safeViewValue = ngModel.$viewValue || '';
          if (editor) {
            $timeout(function() {
              editor.setValue(safeViewValue);
            });
          }
        };
        var editor;
        var options = {
          mode: "javascript",
          lineNumbers: true,
          lineWrapping: true,
          extraKeys: {
            "Ctrl-Q": function(cm) {
              cm.foldCode(cm.getCursor());
            }
          },
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        };
        if (element[0].tagName === 'TEXTAREA') {
          // Might bug but still ...
          editor = window.CodeMirror.fromTextArea(element[0], options);
        } else {
          element.html('');
          editor = new window.CodeMirror(function(cm_el) {
            element.append(cm_el);
          }, options);
        }
        editor.on('change', function(instance) {
          var newValue = instance.getValue();
          if (newValue !== ngModel.$viewValue) {
            scope.$applyAsync(function() {
              ngModel.$setViewValue(newValue);
            });
          }
        });
      }
    };
  }])
.directive('urlFocus', function ($timeout) {
  return {
    link: function (scope, element, attrs) {
      $timeout(function () {
        element.find('input')[0].focus();
      }, 2000);
    }
  }
})