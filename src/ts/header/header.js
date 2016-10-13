'use strict';
var angular = require('angular');
module.exports = function () {
    var libraryApp = angular.module('libraryApp', []);
    //let header = require("html!./header.html");
    var app = angular.module('libraryApp');
    libraryApp.directive('pageHeader', function () {
        return {
            restrict: 'A',
            template: 'ffsdfdsfsdfsd'
        };
    });
};
//# sourceMappingURL=header.js.map