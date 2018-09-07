(function(angular){
    'use strict';


    // Load module
    var module = angular.module('rcHttp');


    module.component( 'rcHttp',
        {
            transclude: true,
            controller: 'rcHttpCtrl',
            controllerAs: '$rcHttp',
            bindings: {
                templateUrl: "<?",
                auto:       "@?",
                service:    "@",
                method:     "@",
                url:        "@",
                config:     "<",
                params:     "<?",
                model:      "=?",
                onStart:    "&",
                onSuccess:  "&",
                onError:    "&"
        }
    });

})(angular);
