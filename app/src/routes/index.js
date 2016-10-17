"use strict";
/**
 * Created by user on 13.10.16.
 */
var angular = require("angular");
require("angular-route");
require("angular-ui-bootstrap");
require("angular-animate");
var libraryApp = angular.module('libraryApp', [
    'ngRoute',
    'ui.bootstrap',
    'pageAside',
    'pageFooter',
    'pageHeader',
    'reviews',
    'ngAnimate'
]);
libraryApp.config(function ($routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
        templateUrl: 'src/templates/books-list.html',
        controller: 'booksList'
    })
        .when('/book/:bookId', {
        templateUrl: 'src/templates/books-page.html',
        controller: 'booksPage'
    })
        .otherwise('/#/');
    $httpProvider.interceptors.push('myInterceptor');
});
//# sourceMappingURL=index.js.map