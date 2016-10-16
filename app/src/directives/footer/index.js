(function () {
    var libraryApp = angular.module('pageFooter', []);
    libraryApp.directive('pageFooter', function () {
        return {
            restrict: 'A',
            templateUrl: 'src/directives/footer/footerView.html'
        };
    });
})();
//# sourceMappingURL=index.js.map