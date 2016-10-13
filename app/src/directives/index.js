/**
 * Created by user on 13.10.16.
 */
'use strict';
var angular = require("angular");
var libraryApp = angular.module('libraryApp');
var footer = require("html!./footer/footerView.html"), aside = require("html!./aside/asideView.html"), header = require("html!./header/headerView.html"), reviewsTpl = require("html!./main/reviews/review.html");
libraryApp.directive('pageHeader', function () {
    return {
        restrict: 'A',
        template: header
    };
});
libraryApp.directive('pageFooter', function () {
    return {
        restrict: 'A',
        template: footer
    };
});
libraryApp.directive('pageAside', function () {
    return {
        restrict: 'A',
        template: aside
    };
});
libraryApp.directive('reviews', function () {
    return {
        restrict: 'E',
        controller: function ($scope) {
            $scope.init = function (comments) {
                $scope.reviews = comments;
            };
            $scope.review = {};
            $scope.addReview = function (book) {
                $scope.reviews.push(this.review);
                $scope.review = {};
            };
        },
        template: reviewsTpl
    };
});
//# sourceMappingURL=index.js.map