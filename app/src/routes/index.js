"use strict";
/**
 * Created by user on 13.10.16.
 */
var angular = require("angular");
require("angular-route");
var libraryApp = angular.module('libraryApp', ['ngRoute']);
libraryApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
        templateUrl: 'src/directives/main/books-list/books-list.html',
        controller: 'booksList'
    })
        .when('/book/:bookId', {
        templateUrl: 'src/directives/main/books-page/books-page.html',
        controller: 'booksPage'
    })
        .otherwise('/');
});
//# sourceMappingURL=index.js.map