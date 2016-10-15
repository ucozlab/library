/**
 * Created by user on 13.10.16.
 */
'use strict';
var angular = require("angular");
var libraryApp = angular.module('libraryApp');
libraryApp.factory('myInterceptor', function () {
    //$log.debug('$log используется чтобы показать что это стандартная фабрика, в которую можно инжектить сервисы');
    return {
        'request': function (config) {
            console.log('request: ');
            console.dir(config);
            return config;
        },
        'response': function (response) {
            console.log('response: ');
            console.dir(response);
            return response;
        },
        'responseError': function (rejection) {
            console.log('rejection: ');
            console.dir(rejection);
            return rejection;
        }
    };
});
//# sourceMappingURL=index.js.map