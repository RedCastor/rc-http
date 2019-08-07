(function(angular) {
    "use strict";
    var module = angular.module("rcHttp", []);
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcHttp");
    module.component("rcHttp", {
        transclude: true,
        controller: "rcHttpCtrl",
        controllerAs: "$rcHttp",
        bindings: {
            templateUrl: "<?",
            auto: "@?",
            service: "@",
            method: "@",
            url: "@",
            config: "<",
            params: "<?",
            data: "<",
            response: "<",
            model: "=?",
            onStart: "&",
            onSuccess: "&",
            onError: "&"
        }
    });
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcHttp");
    module.controller("rcHttpCtrl", [ "$scope", "$element", "$attrs", "$transclude", "$templateRequest", "$injector", "$log", function($scope, $element, $attrs, $transclude, $templateRequest, $injector, $log) {
        var rcHttp = this;
        var $service;
        function init() {
            rcHttp.isPending = undefined;
        }
        function get_response(response, resolved, init) {
            return {
                data: !init ? response.data || null : undefined,
                success: resolved === true ? true : false,
                status: response.status || (resolved === true ? 200 : 400),
                statusText: response.statusText || (resolved === true ? "OK" : "Bad Request")
            };
        }
        this.$onInit = function() {
            $templateRequest(angular.isString(rcHttp.templateUrl) ? rcHttp.templateUrl : "rc-http.tpl.html").then(function(html) {
                if (!angular.isString(rcHttp.templateUrl)) {
                    $element.append($transclude($scope, function() {}));
                }
                if (html.length) {
                    var template = angular.element(html);
                    $element.append(template);
                    var $compile = $injector.get("$compile");
                    $compile(template)($scope);
                }
            }, function(error) {});
            if (!angular.isString(rcHttp.service) || !rcHttp.service.length || !$injector.has(rcHttp.service)) {
                rcHttp.service = "$http";
            }
            $service = $injector.get(rcHttp.service);
            if (!angular.isString(rcHttp.method) || !rcHttp.method.length || typeof $service[rcHttp.method] !== "function") {
                rcHttp.method = "get";
            }
            if (!angular.isString(rcHttp.url) || !rcHttp.url.length) {
                rcHttp.url = false;
            }
            rcHttp.auto = angular.isUndefined(rcHttp.auto) || rcHttp.auto === true ? true : false;
            rcHttp.data = angular.isObject(rcHttp.data) ? rcHttp.data : {};
            rcHttp.response = rcHttp.response ? angular.copy(get_response(rcHttp.response, true, true)) : get_response({}, false);
            rcHttp.config = angular.isObject(rcHttp.config) ? rcHttp.config : {
                cache: true
            };
            if (angular.isObject(rcHttp.params)) {
                angular.extend(rcHttp.config.params, rcHttp.params);
            }
            if (rcHttp.auto === true) {
                if (rcHttp.service !== "$http" || rcHttp.service === "$http" && rcHttp.url) {
                    rcHttp.send();
                }
            }
        };
        this.send = function(config) {
            try {
                rcHttp.isPending = true;
                if (angular.isObject(config) && angular.isObject(config.form)) {
                    if (angular.isFunction(config.form.$setTouched)) {
                        config.form.$setTouched();
                    }
                    if (angular.isFunction(config.form.$validate)) {
                        config.form.$validate();
                    }
                    if (!config.form.$valid) {
                        return false;
                    }
                }
                if (rcHttp.model) {
                    rcHttp.config.data = rcHttp.model;
                }
                config = angular.isObject(config) ? config : angular.copy(rcHttp.config);
                config.params = !config.params ? angular.copy(rcHttp.config.params) : config.params;
                config.data = !config.data ? angular.copy(rcHttp.config.data) : config.data;
                rcHttp.onStart({
                    $config: config
                });
                var http_instance;
                switch (rcHttp.method) {
                  case "get":
                  case "delete":
                  case "head":
                  case "jsonp":
                    http_instance = $service[rcHttp.method](rcHttp.url, config);
                    break;

                  case "post":
                  case "put":
                  case "patch":
                    http_instance = $service[rcHttp.method](rcHttp.url, rcHttp.model, config);
                    break;

                  default:
                    {
                        if (!rcHttp.url) {
                            http_instance = $service[rcHttp.method](rcHttp.model, config);
                        } else {
                            http_instance = $service[rcHttp.method](rcHttp.url, rcHttp.model, config);
                        }
                    }
                }
                http_instance.then(function(success) {
                    rcHttp.response = get_response(success, true);
                    rcHttp.onSuccess({
                        $response: rcHttp.response
                    });
                    rcHttp.isPending = false;
                }, function(error) {
                    rcHttp.response = get_response(error, false);
                    rcHttp.onError({
                        $response: rcHttp.response
                    });
                    rcHttp.isPending = false;
                });
                return http_instance;
            } catch (e) {
                $log.error(e);
                var error = {
                    status: 0,
                    statusText: "Error send request"
                };
                rcHttp.response = get_response(error, false);
                rcHttp.onError({
                    $response: rcHttp.response
                });
                rcHttp.isPending = false;
            }
        };
        init();
    } ]);
})(angular);

angular.module("rcHttp").run([ "$templateCache", function($templateCache) {
    $templateCache.put("rc-http.tpl.html", "");
} ]);
//# sourceMappingURL=rc-http.js.map
