(function () {
    var app = angular.module('reviews', []);
    app.directive('reviews', function ($http, $sce) {
        return {
            restrict: 'E',
            controller: function ($scope) {
                $scope.review = {};
                $scope.init = function (name, id) {
                    //This function is sort of private constructor for controller
                    $scope.ids = id;
                    $scope.names = name;
                    //Based on passed argument you can make a call to resource
                    //and initialize more objects
                    //$resource.getMeBond(007)
                };
                $scope.addReview = function (book, reviewForm) {
                    var _this = this;
                    this.review.createdOn = Date.now();
                    var id = $scope.book.id, data = {
                        pageId: id,
                        review: this.review
                    }, success = '<div class="alert alert-success" role="alert"><strong>Woohoo!</strong> Successfully added.</div>', fail = '<div class="alert alert-danger" role="alert"><strong>Oops!</strong> can\'t post data to server!.</div>';
                    $http.post("/books/" + id + "/postreview", data).then(function () {
                        $scope.book.reviews.push(_this.review);
                        $scope.review = {};
                        reviewForm.$setPristine();
                        $scope.ServerResponse = $sce.trustAsHtml(success);
                        $scope.countRating();
                    }, function () {
                        $scope.ServerResponse = $sce.trustAsHtml(fail);
                    });
                    $scope.killTooltip();
                };
            },
            templateUrl: 'src/directives/reviews/review.html'
        };
    });
})();
//# sourceMappingURL=index.js.map