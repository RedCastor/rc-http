(function(angular){
  'use strict';

  var module = angular.module('rcHttp');


  module.controller('rcHttpCtrl', [
      '$scope',
      '$element',
      '$attrs',
      '$transclude',
      '$templateRequest',
      '$injector',
      '$log',
      function ( $scope, $element, $attrs, $transclude, $templateRequest, $injector, $log ) {

      var rcHttp = this;
      var $service;

      function init() {

          rcHttp.isPending = false;
      }


      function get_response(response, success) {

          return {
              data: response.data,
              success: success || true,
              status: response.status || (success === true ? 200 : 400),
              statusText: response.statusText || (success === true ? 'OK' : 'Bad Request'),
          };
      }

      this.$onInit = function() {

          //Get Template url or transclude if empty
          $templateRequest(angular.isString(rcHttp.templateUrl) ? rcHttp.templateUrl : "rc-http.tpl.html").then(
              function(html){

                  //If no template url transclude with default empty template.
                  if (!angular.isString(rcHttp.templateUrl)) {
                      $element.append($transclude($scope, function () {}));
                  }

                  if (html.length) {
                      var template = angular.element(html);
                      $element.append(template);

                      var $compile = $injector.get('$compile');
                      $compile(template)($scope);
                  }
              },
              function (error) {

              }
          );

          //Set default service
          if (!angular.isString(rcHttp.service) || !rcHttp.service.length || !$injector.has(rcHttp.service)) {
              rcHttp.service = '$http';
          }

          //Load Service by inject
          $service = $injector.get(rcHttp.service);

          //Set default method
          if (!angular.isString(rcHttp.method) || !rcHttp.method.length || typeof $service[rcHttp.method] !== 'function') {
              rcHttp.method = 'get';
          }

          if ( !angular.isString(rcHttp.url) || !rcHttp.url.length) {
              rcHttp.url = false;
          }

          rcHttp.auto = angular.isUndefined(rcHttp.auto) || rcHttp.auto === true ? true : false;
          rcHttp.data = angular.isObject(rcHttp.data) ? rcHttp.data : {};
          rcHttp.response = rcHttp.response ? angular.copy(get_response(rcHttp.response)) : get_response({}, false);
          rcHttp.config = angular.isObject(rcHttp.config) ? rcHttp.config : {cache: true};

          if (angular.isObject(rcHttp.params)) {
              angular.extend(rcHttp.config.params, rcHttp.params);
          }

          //Call Request
          if (rcHttp.auto === true) {

              if ( rcHttp.service !== '$http' || (rcHttp.service === '$http' && rcHttp.url) ) {
                  rcHttp.send();
              }
          }


      };


      this.send = function(config) {

          try {

              rcHttp.isPending = true;
              rcHttp.onStart();

              if (rcHttp.model) {
                  rcHttp.config.data = rcHttp.model;
              }

              config = angular.isObject(config) ? config : angular.copy(rcHttp.config);
              config.params = !config.params ? angular.copy(rcHttp.config.params) : config.params;
              config.data = !config.data ? angular.copy(rcHttp.config.data) : config.data;

              var http_instance;

              //Resolve instance method type
              switch($service[rcHttp.method]) {
                  case 'get':
                  case 'delete':
                  case 'head':
                  case 'jsonp':
                      http_instance = $service[rcHttp.method](rcHttp.url, config);
                      break;
                  case 'post':
                  case 'put':
                  case 'patch':
                      http_instance = $service[rcHttp.method](rcHttp.url, rcHttp.model, config);
                      break;
                  default: {
                      if (!rcHttp.url) {
                          http_instance = $service[rcHttp.method](rcHttp.model, config);
                      }
                      else {
                          http_instance = $service[rcHttp.method](rcHttp.url, rcHttp.model, config);
                      }
                  }
              }


              http_instance.then(function(success) {

                  rcHttp.response = get_response(success, true);

                  rcHttp.onSuccess({ $response: rcHttp.response });
                  rcHttp.isPending = false;
              }, function(error) {

                  rcHttp.response = get_response(error, false);

                  rcHttp.onError({ $response: rcHttp.response });
                  rcHttp.isPending = false;
              });

              return http_instance;
          }
          catch (e) {
              $log.error(e);

              rcHttp.onError({ $error: {message: 'Error send request rcHttp'} });
              rcHttp.isPending = false;
          }
      };


      init();

  }]);

})(angular);
