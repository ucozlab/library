/**
 * Created by user on 13.10.16.
 */
'use strict';

import * as angular from "angular";
declare var require: Function;

let libraryApp = angular.module('libraryApp');

let	footer  	= require("html!./footer/footerView.html"),
	aside   	= require("html!./aside/asideView.html"),
	header      = require("html!./header/headerView.html"),
	reviewsTpl 	= require("html!./main/reviews/review.html");

libraryApp.directive('pageHeader',function () {
	return {
		restrict: 'A',
		template: header
	}
});

libraryApp.directive('pageFooter',function () {
	return {
		restrict: 'A',
		template: footer
	}
});

libraryApp.directive('pageAside',function () {
	return {
		restrict: 'A',
		template: aside
	}
});


libraryApp.directive('reviews',function () {
	return {
		restrict: 'E',
		controller: function ($scope) {
			$scope.init = function(comments){	// берем из аттрибута
				$scope.reviews = comments;
			};

			$scope.review = {};

			$scope.addReview = function(book){
				$scope.reviews.push(this.review);
				$scope.review = {};
			};
		},
		template: reviewsTpl
	}
});

