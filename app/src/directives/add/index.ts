/**
 * Created by Admin on 23.10.2016.
 */
import * as angular from "angular";
(function() {
	var libraryApp = angular.module('addNew',[]);
	libraryApp.directive('addNew',function () {

		return {
			restrict: 'E',
			templateUrl: 'src/directives/add/add.html',
			controller: addController,
			controllerAs: 'new'
		};
		function addController ($scope) {
			$scope.storage = JSON.parse(localStorage.getItem("modules"));
			$scope.module = Object.keys($scope.storage)[0];	// первый по умолчанию
			$scope.addNew = (addForm) => {
				$scope.storage[$scope.module].push(this.new);
				localStorage.setItem("modules", JSON.stringify($scope.storage));
			}
		}
	});
})();