(function(angular){
    'use strict';


    // Load module
    var module = angular.module('rcHttp');


    module.component( 'rcHttp', {

        transclude: true,
        controller: 'rcHttpCtrl',
        controllerAs: '$rcHttp',
        bindings: {
            service:    "@",
            method:     "@",
            url:        "@",
            config:     "<",
            params:     "<?",
            model:      "=?",
            onStart:    "&",
            onSuccess:  "&",
            onError:    "&"
        },
        templateUrl: ['$element', '$attrs', function ($element, $attrs) {
            return $attrs.templateUrl || 'rc-http.tpl.html';
        }]
    });

})(angular);
