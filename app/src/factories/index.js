/**
 * Created by user on 13.10.16.
 */
'use strict';
var angular = require("angular");
var libraryApp = angular.module('libraryApp');
libraryApp
    .factory('Application', function ($log) {
    return {};
})
    .factory('myInterceptor', function (Application) {
    //$log.debug('$log используется чтобы показать что это стандартная фабрика, в которую можно инжектить сервисы');
    return {
        'request': function (config) {
            if (config.url == 'src/model/books.json') {
                console.log('request: ');
                console.dir(config);
            }
            return config;
        },
        'response': function (response) {
            //console.log('response: ');
            //console.dir(response);
            return response;
        },
        'responseError': function (rejection) {
            //console.log('rejection: ');
            //console.dir(rejection);
            return rejection;
        }
    };
});
//# sourceMappingURL=index.js.map