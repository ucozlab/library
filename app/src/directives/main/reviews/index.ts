(function() {
	var app = angular.module('reviews',[]);
	app.directive('reviews',function () {
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
			templateUrl: 'src/directives/main/reviews/review.html'
		}
	});
})();