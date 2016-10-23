import * as angular from "angular";
(function() {
	var libraryApp = angular.module('pageHeader',[]);
	libraryApp.directive('pageHeader',function () {
		return {
			restrict: 'A',
			templateUrl: 'src/directives/header/headerView.html'
		}
	});
})();