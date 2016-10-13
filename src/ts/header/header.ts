'use strict';
import * as angular from 'angular';

module.exports = function(){

	let libraryApp = angular.module('libraryApp', []);
	//let header = require("html!./header.html");

	let app = angular.module('libraryApp');

	libraryApp.directive('pageHeader',function () {
		return {
			restrict: 'A',
			template: 'ffsdfdsfsdfsd'
		}
	});

};