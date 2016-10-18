/**
 * @param {{some_unres_var:string}} data
 */
(function() {
	var app = angular.module('reviews',[]);
	app.directive('reviews',function ($http) {
		return {
			restrict: 'E',
			scope: {
				siteModule: '='
			},
			bindToController: true,
			controllerAs: '$ctrl',
			controller: function ($scope,$timeout,tooltip) {

				var $ctrl = this;

				$scope.review = {};

				$scope.addReview = function(reviewForm){

					this.review.createdOn = Date.now();

					let pageId = $ctrl.siteModule.id,
						moduleName = $ctrl.siteModule.moduleName,
						data = {
							moduleName: moduleName,
							pageId : pageId,
							review : this.review
						};

					$http.post(`/${moduleName}/${pageId}/postreview`, data).then(
						() => {
							$ctrl.siteModule.reviews.push(this.review);
							$scope.review = {};
							reviewForm.$setPristine();
							$scope.ServerResponse = tooltip.success();
							typeof $scope.$parent.countRating === 'function' && $scope.$parent.countRating();

						},
						() => {
						$scope.ServerResponse = tooltip.fail();
					});

					$timeout(() => {
						$scope.ServerResponse = tooltip.remove();
					},4000);

				};

			},
			templateUrl: 'src/directives/reviews/review.html'
		}
	});
})();