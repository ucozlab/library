/**
 * Created by user on 13.10.16.
 */
'use strict';
var angular = require("angular");
var localstorage_1 = require('../model/localstorage');
var libraryApp = angular.module('libraryApp');
libraryApp
    .factory('Application', function ($log) {
    return {};
})
    .factory('myInterceptor', function (Application) {
    //$log.debug('$log используется чтобы показать что это стандартная фабрика, в которую можно инжектить сервисы');
    return {
        'request': function (config) {
            if (config.url.indexOf("/postreview") > -1) {
                localstorage_1.addNewComment(config.data);
            }
            return config;
        },
        'response': function (response) {
            if (response.config.url === 'src/model/books.json' && response.config.method === "GET") {
                //Intercept GET data & send it from Localstorage
                response.data = localstorage_1.getLocalStorage();
            }
            return response;
        },
        'responseError': function (rejection) {
            if (rejection.config.url === 'src/model/books.json' && rejection.config.method === "POST") {
                localstorage_1.buyBookInLocalStorage(rejection.config.data);
            }
            return rejection;
        }
    };
});
//# sourceMappingURL=index.js.map