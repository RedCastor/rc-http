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
            service: "@",
            method: "@",
            url: "@",
            config: "<",
            params: "<?",
            model: "=?",
            onStart: "&",
            onSuccess: "&",
            onError: "&"
        },
        templateUrl: [ "$element", "$attrs", function($element, $attrs) {
            return $attrs.templateUrl || "rc-http.tpl.html";
        } ]
    });
})(angular);

(function(angular) {
    "use strict";
    var module = angular.module("rcHttp");
    module.controller("rcHttpCtrl", [ "$scope", "$element", "$attrs", "$transclude", "$log", "$injector", function($scope, $element, $attrs, $transclude, $log, $injector) {
        var rcHttp = this;
        function init() {
            rcHttp.isPending = false;
        }
        this.$onInit = function() {
            if (!$attrs.templateUrl) {
                $element.append($transclude($scope, function() {}));
            }
            rcHttp.service = angular.isString(rcHttp.service) ? rcHttp.service : "$http";
            rcHttp.method = angular.isString(rcHttp.method) ? rcHttp.method : "get";
            rcHttp.url = angular.isString(rcHttp.url) ? rcHttp.url : "";
            rcHttp.config = angular.isObject(rcHttp.config) ? rcHttp.config : {
                cache: true
            };
            rcHttp.http(rcHttp.service, rcHttp.method, rcHttp.url, rcHttp.config);
        };
        this.http = function(service, method, url, config) {
            rcHttp.isPending = true;
            rcHttp.onStart();
            var $service = $injector.get(service);
            if (rcHttp.params) {
                angular.extend(config.params, rcHttp.params);
            }
            if (rcHttp.model) {
                angular.extend(config.data, rcHttp.model);
            }
            var http_instance = $service[method](url, config);
            http_instance.then(function(success) {
                rcHttp.data = success.data ? success.data : success;
                rcHttp.onSuccess({
                    $success: rcHttp.data
                });
                rcHttp.isPending = false;
            }, function(error) {
                rcHttp.onError({
                    $error: error
                });
                rcHttp.isPending = false;
            });
            return http_instance;
        };
        init();
    } ]);
})(angular);

angular.module("rcHttp").run([ "$templateCache", function($templateCache) {
    $templateCache.put("rc-http.tpl.html", "");
} ]);
//# sourceMappingURL=rc-http.js.map
