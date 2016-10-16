(function () {
    var libraryApp = angular.module('pageHeader', []);
    libraryApp.directive('pageHeader', function () {
        return {
            restrict: 'A',
            templateUrl: 'src/directives/header/headerView.html'
        };
    });
})();
//# sourceMappingURL=index.js.map