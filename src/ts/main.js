/**
 * Created by user on 10.10.16.
 */
'use strict';
require('../../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../less/main.less');
var angular = require("angular");
//import * as ngRoute from "angular-route";
require("angular-route");
var libraryApp = angular.module('libraryApp', ['ngRoute']);
var books = [
    {
        title: 'Empire of the Sun',
        author: 'J. G. Ballard',
        image: 'https://images-na.ssl-images-amazon.com/images/I/51bDdAkWnPL._SX324_BO1,204,203,200_.jpg',
        description: 'The classic, heartrending story of a British boy’s four year ordeal in a Japanese prison camp during the Second World War. Newly reissued with an introduction by John Lanchester.\
		Based on J. G. Ballard’s own childhood, this is the extraordinary account of a boy’s life in Japanese-occupied wartime Shanghai – a mesmerising, hypnotically compelling novel of war, of starvation and survival, of internment camps and death marches. It blends searing honesty with an almost hallucinatory vision of a world thrown utterly out of joint.',
        price: 8.99,
        pageCount: 352,
        isAvailable: true,
        rating: 20,
        ordered: 30,
        comments: 0
    },
    {
        title: 'The Lord of the Rings (7 book)',
        author: 'J.R.R. Tolkien',
        image: 'https://images-na.ssl-images-amazon.com/images/I/31aaOSA4JlL._BO1,204,203,200_.jpg',
        description: 'Continuing the story of The Hobbit, this seven-volume paperback boxed set of Tolkien’s epic masterpiece, The Lord of the Rings is a collection to treasure.\
		Sauron, the Dark Lord, has gathered to him all the Rings of Power; the means by which he intends to rule Middle-earth. All he lacks in his plans for dominion is the One Ring – the ring that rules them all – which has fallen into the hands of the hobbit, Bilbo Baggins.',
        price: 24.99,
        pageCount: 860,
        isAvailable: true,
        rating: 100,
        ordered: 130,
        comments: 0
    },
    {
        title: 'The Drowned World',
        author: 'J. G. Ballard',
        image: 'https://images-na.ssl-images-amazon.com/images/I/51e-SIgMloL._SX322_BO1,204,203,200_.jpg',
        description: 'The classic, heartrending story of a British boy’s four year ordeal in a Japanese prison camp during the Second World War. Newly reissued with an introduction by John Lanchester.\
		Based on J. G. Ballard’s own childhood, this is the extraordinary account of a boy’s life in Japanese-occupied wartime Shanghai – a mesmerising, hypnotically compelling novel of war, of starvation and survival, of internment camps and death marches. It blends searing honesty with an almost hallucinatory vision of a world thrown utterly out of joint.',
        price: 8.99,
        pageCount: 176,
        isAvailable: true,
        rating: 20,
        ordered: 30,
        comments: 0
    }
];
libraryApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
        templateUrl: '../src/main/books/books-list/books-list.html',
        controller: 'booksList'
    })
        .when('/test', {
        template: '<p>sdfdsfsdsdfds</p>',
        controller: 'booksList'
    })
        .when('/test2', {
        templateUrl: 'tmp.html',
        controller: 'booksList'
    })
        .when('/books/:booksId', {
        templateUrl: './main/books/books-page/books-page.html',
        controller: function ($scope) {
            $scope.bookslist = books;
        }
    });
});
libraryApp.controller('booksList', function ($scope) {
    $scope.bookslist = books;
});
var tpl = require("html!../app.html"), footer = require("html!./footer/footer.html"), aside = require("html!./aside/aside.html"), main = require("html!./main/main.html"), header = require("html!./header/header.html");
libraryApp.directive('app', function () {
    return {
        restrict: 'E',
        template: tpl
    };
});
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
/*libraryApp.directive('pageMain',function () {
    return {
        restrict: 'A',
        template: main,
        controller: function ($scope) {
            $scope.bookslist = books;
        }
    }
});*/
/*
import welcome from './welcome';

//welcome('HOME');
//welcome('33--11');

export default welcome;
*/ 
//# sourceMappingURL=main.js.map