"use strict";
var angular = require('angular');
var libraryApp = angular.module('libraryApp');
//localStorage.setItem("books", JSON.stringify(books));
//let books = JSON.parse(localStorage.getItem('books'));
libraryApp.controller('booksList', function ($scope, $http) {
    $scope.bookslist = [];
    $http.get('src/model/books.json').then(function (response) {
        $scope.bookslist = response.data;
    }, function () { return alert('can\'t load data from server!'); });
    $scope.getTotal = function () {
        var total = 0;
        for (var i = 0; i < $scope.bookslist.length; i++) {
            total += $scope.bookslist[i].ordered;
        }
        return total;
    };
});
libraryApp.controller('booksPage', ['$scope', '$routeParams', '$http', '$sce', '$timeout', 'myInterceptor', function ($scope, $routeParams, $http, $sce, $timeout) {
        var id = $routeParams.bookId;
        $scope.book = {};
        $http.get('src/model/books.json').then(function (response) {
            $scope.book = response.data[id];
        }, function () { return alert('can\'t load data from server!'); });
        $scope.orderBook = function () {
            $scope.book.isAvailable ? $scope.sendOrder() : $scope.rejectOrder();
        };
        $scope.sendOrder = function () {
            var data = Object.assign({}, $scope.book);
            $http.post('src/model/books.json', data).then(function () {
                $scope.ServerResponse = $sce.trustAsHtml('<div class="alert alert-success" role="alert">\
				<strong>Woohoo!</strong> Successfully ordered.\
			</div>');
                $scope.book.ordered += 1;
            }, function () {
                $scope.ServerResponse = $sce.trustAsHtml('<div class="alert alert-danger" role="alert">\
				<strong>Oops!</strong> can\'t post data to server!.\
			</div>');
            });
            $scope.killTooltip();
        };
        $scope.rejectOrder = function () {
            $scope.ServerResponse = $sce.trustAsHtml('<div class="alert alert-info" role="alert">\
				Sorry, this book isn\'t available\
			</div>');
            $scope.killTooltip();
        };
        $scope.killTooltip = function () {
            $timeout(function () {
                $scope.ServerResponse = $sce.trustAsHtml('<p></p>');
            }, 4000);
        };
    }]);
//# sourceMappingURL=index.js.map