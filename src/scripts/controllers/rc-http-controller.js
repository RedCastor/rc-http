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

      function init() {

          rcHttp.isPending = false;
      }

      this.$onInit = function() {

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

          rcHttp.auto = angular.isUndefined(rcHttp.auto) || rcHttp.auto === true ? true : false;
          rcHttp.service = angular.isString(rcHttp.service) ? rcHttp.service : '$http';
          rcHttp.method = angular.isString(rcHttp.method) ? rcHttp.method : 'get';
          rcHttp.url = angular.isString(rcHttp.url) ? rcHttp.url : "";
          rcHttp.config = angular.isObject(rcHttp.config) ? rcHttp.config : {cache: true};

          if (rcHttp.params) {
              angular.extend(rcHttp.config.params, rcHttp.params);
          }

          if (rcHttp.auto === true) {
            rcHttp.request();
          }
      };


      this.request = function(config) {

          try {
              var $service = $injector.get(rcHttp.service);

              rcHttp.isPending = true;
              rcHttp.onStart();

              if (rcHttp.model) {
                  rcHttp.config.data = rcHttp.model;
              }

              config = angular.isObject(config) ? config : angular.copy(rcHttp.config);
              config.params = !config.params ? angular.copy(rcHttp.config.params) : config.params;
              config.data = !config.data ? angular.copy(rcHttp.config.data) : config.data;

              var http_instance = $service[rcHttp.method](rcHttp.url, config);

              http_instance.then(function(success) {

                  rcHttp.data = success.data ? success.data : success;

                  rcHttp.onSuccess({ $success: rcHttp.data });
                  rcHttp.isPending = false;
              }, function(error) {

                  rcHttp.onError({ $error: error });
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
