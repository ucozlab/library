/**
 * Created by user on 13.10.16.
 */
import * as angular from "angular";
import "angular-route";
import "angular-ui-bootstrap";
import "angular-animate";

var libraryApp = angular.module('libraryApp', [
	'ngRoute',
	'ui.bootstrap',
	'pageAside',
	'pageFooter',
	'pageHeader',
	'reviews',
	'ngAnimate'
]);

libraryApp.config(function($routeProvider,$httpProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'src/templates/main.html',
			controller: 'booksList'
		})
		.when('/books', {
			templateUrl: 'src/templates/books-list.html',
			controller: 'booksList'
		})
		.when('/book/:bookId', {
			templateUrl: 'src/templates/books-page.html',
			controller: 'booksPage'
		})
		.when('/audio', {
			templateUrl: 'src/templates/audio-list.html',
			controller: 'audioList'
		})
		.when('/audio/:audioId', {
			templateUrl: 'src/templates/audio-page.html',
			controller: 'audioPage'
		})
		.otherwise('/#/');

	$httpProvider.interceptors.push('myInterceptor');

});