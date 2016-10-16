(function() {
	var libraryApp = angular.module('pageAside',[]);
	libraryApp.directive('pageAside',function () {
		return {
			restrict: 'A',
			templateUrl: 'src/directives/aside/asideView.html'
		}
	});
})();