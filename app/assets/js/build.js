var home =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
	import '../assets/less/main.less';

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Created by user on 13.10.16.
	 */
	import * as angular from "angular";
	import "angular-route";
	import "angular-ui-bootstrap";
	import "angular-animate";

	var libraryApp = angular.module('libraryApp', [
		'ngRoute',
		'ui.bootstrap',
		'pageAside',
		'pageFooter',
		'pageHeader',
		'reviews',
		'ngAnimate'
	]);

	libraryApp.config(function($routeProvider,$httpProvider) {

		$routeProvider
			.when('/', {
				templateUrl: 'src/templates/books-list.html',
				controller: 'booksList'
			})
			.when('/book/:bookId', {
				templateUrl: 'src/templates/books-page.html',
				controller: 'booksPage'
			})
			.otherwise('/#/');

		$httpProvider.interceptors.push('myInterceptor');

	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Created by user on 13.10.16.
	 */
	'use strict';

	import * as angular from "angular";
	import { getLocalStorage, buyBookInLocalStorage, addNewComment } from '../model/localstorage';

	let libraryApp = angular.module('libraryApp');

	libraryApp
		.factory('tooltip', function($timeout,$sce) {
			let fail    	= '<div class="alert alert-danger" role="alert"><strong>Oops!</strong> can\'t post data to server!.</div>',
				success 	= '<div class="alert alert-success" role="alert"><strong>Woohoo!</strong> Successfully added.</div>',
				unAvailable = '<div class="alert alert-info" role="alert">Sorry, this book isn\'t available</div>',
				ordered		= '<div class="alert alert-success" role="alert"><strong>Woohoo!</strong> Successfully ordered.</div>';
			return {
				create(){
					return alert();
				},
				unAvailable(){
					return $sce.trustAsHtml(unAvailable);
				},
				ordered(){
					return $sce.trustAsHtml(ordered);
				},
				fail(){
					return $sce.trustAsHtml(fail);
				},
				success(){
					return $sce.trustAsHtml(success);
				},
				remove() {
					return $sce.trustAsHtml('<p></p>');
				}
			};
		})
		.factory('myInterceptor', () => {
			//$log.debug('$log используется чтобы показать что это стандартная фабрика, в которую можно инжектить сервисы');
			return {
				'request': function(config) {

					if( config.url.indexOf("/postreview") > -1) { //Intercept POST comment & send it to Localstorage
						addNewComment(config.data);
					}

					return config;
				},
				'response': function (response) {

					if( response.config.url === 'src/model/books.json' && response.config.method === "GET" ) {
						//Intercept GET data & send it from Localstorage
						response.data = getLocalStorage();
					}

					return response;
				},
				'responseError': function(rejection) {

					if (rejection.config.url === 'src/model/books.json' && rejection.config.method === "POST") {
						buyBookInLocalStorage(rejection.config.data);
					}

					return rejection;
				}
			};
		});




/***/ },
/* 3 */
/***/ function(module, exports) {

	
	import * as angular from 'angular';

	let libraryApp = angular.module('libraryApp');

	//localStorage.setItem("books", JSON.stringify(books));
	//let books = JSON.parse(localStorage.getItem('books'));



	libraryApp.controller('booksList', function ($scope,$http) {

		$scope.bookslist = [];

		$http.get('src/model/books.json').then(
			( response ) => {
				$scope.bookslist = response.data;
			},
			() => alert('can\'t load data from server!')
		);

		$scope.getTotal = function(){
			let total = 0;
			for(let i = 0; i < $scope.bookslist.length; i++){
				total += $scope.bookslist[i].ordered.length;
			}
			return total;
		}

	});

	libraryApp.controller('booksPage', [
		'$scope',
		'$routeParams',
		'$http',
		'$timeout',
		'$uibModal',
		'tooltip',
		function ($scope,$routeParams,$http,$timeout,$uibModal,tooltip) {

		let id = $routeParams.bookId,
			$ctrl = this;

		$scope.book = {};
		$scope.shipAdress = '';

		$http.get('src/model/books.json').then(
			// перехватываем интерсептором
			( response ) => {
				$scope.book = response.data[id];
				$scope.countRating();
			},
			() => alert('can\'t load data from server!')
		);

		$scope.countRating = () => {
			$scope.allRating = 0;
			if ($scope.book.reviews && $scope.book.reviews.length) {
				angular.forEach($scope.book.reviews, function (value) {
					$scope.allRating += value.stars;
				});
				$scope.allRating = ($scope.allRating / $scope.book.reviews.length).toFixed(1);
			}
			return $scope.allRating;
		};

		$scope.orderBook = () => {
			$scope.book.isAvailable ? $scope.modalOpen() : $scope.rejectOrder();
		};

		$scope.rejectOrder = () => {
			$scope.ServerResponse = tooltip.unAvailable();
			$timeout(() => {
				$scope.ServerResponse = tooltip.remove();
			},4000);
		};

		$scope.modalOpen = () => {
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				controllerAs: '$ctrl',
				size: 'sm',
				resolve: {
					title: function () {
						return $scope.book.title
					}
				}
			});

			modalInstance.result.then(function (inputData) {
				$scope.book.shipAdress = inputData;
				$scope.sendOrder();
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.sendOrder = () => {

			let data = $scope.book;

			$http.post('src/model/books.json', data).then( (response) => {

				$scope.ServerResponse = tooltip.ordered();
				$scope.book.ordered.length += 1;

				//$rootScope.$emit("CallParentMethod", {});

			}, () => {
				$scope.ServerResponse = tooltip.fail();
			});
			$timeout(() => {
				$scope.ServerResponse = tooltip.remove();
			},4000);
		};

	}]);

	libraryApp.controller('ModalInstanceCtrl', function ($uibModalInstance,$scope) {

		let $ctrl = this;

		$scope.data = {
			shipAdress : ''
		};

		$ctrl.ok = function () {
			$uibModalInstance.close($scope.data.shipAdress);
		};

		$ctrl.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);

/***/ },
/* 5 */
/***/ function(module, exports) {

	(function() {
		var libraryApp = angular.module('pageHeader',[]);
		libraryApp.directive('pageHeader',function () {
			return {
				restrict: 'A',
				templateUrl: 'src/directives/header/headerView.html'
			}
		});
	})();

/***/ },
/* 6 */
/***/ function(module, exports) {

	(function() {
		var libraryApp = angular.module('pageFooter',[]);
		libraryApp.directive('pageFooter',function () {
			return {
				restrict: 'A',
				templateUrl: 'src/directives/footer/footerView.html'
			}
		});
	})();

/***/ },
/* 7 */
/***/ function(module, exports) {

	(function() {
		var libraryApp = angular.module('pageAside',[]);
		libraryApp.directive('pageAside',function () {
			return {
				restrict: 'A',
				templateUrl: 'src/directives/aside/asideView.html'
			}
		});
	})();

/***/ },
/* 8 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDAwODZkYjIzODk5MDZjYzc0NjEiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy9yb3V0ZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy9mYWN0b3JpZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy9jb250cm9sbGVycy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9hcHAvc3JjL2RpcmVjdGl2ZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy9kaXJlY3RpdmVzL2hlYWRlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9hcHAvc3JjL2RpcmVjdGl2ZXMvZm9vdGVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL2FwcC9zcmMvZGlyZWN0aXZlcy9hc2lkZS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9hcHAvc3JjL2RpcmVjdGl2ZXMvcmV2aWV3cy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDAwMDg2ZGIyMzg5OTA2Y2M3NDYxXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJy4uLy4uL25vZGVfbW9kdWxlcy9ib290c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3MnO1xuaW1wb3J0ICcuLi9hc3NldHMvbGVzcy9tYWluLmxlc3MnO1xuXG5yZXF1aXJlKCcuL3JvdXRlcycpO1xucmVxdWlyZSgnLi9mYWN0b3JpZXMnKTtcbnJlcXVpcmUoJy4vY29udHJvbGxlcnMnKTtcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcycpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc3JjL2FwcC50c1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDEzLjEwLjE2LlxuICovXG5pbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gXCJhbmd1bGFyXCI7XG5pbXBvcnQgXCJhbmd1bGFyLXJvdXRlXCI7XG5pbXBvcnQgXCJhbmd1bGFyLXVpLWJvb3RzdHJhcFwiO1xuaW1wb3J0IFwiYW5ndWxhci1hbmltYXRlXCI7XG5cbnZhciBsaWJyYXJ5QXBwID0gYW5ndWxhci5tb2R1bGUoJ2xpYnJhcnlBcHAnLCBbXG5cdCduZ1JvdXRlJyxcblx0J3VpLmJvb3RzdHJhcCcsXG5cdCdwYWdlQXNpZGUnLFxuXHQncGFnZUZvb3RlcicsXG5cdCdwYWdlSGVhZGVyJyxcblx0J3Jldmlld3MnLFxuXHQnbmdBbmltYXRlJ1xuXSk7XG5cbmxpYnJhcnlBcHAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCRodHRwUHJvdmlkZXIpIHtcblxuXHQkcm91dGVQcm92aWRlclxuXHRcdC53aGVuKCcvJywge1xuXHRcdFx0dGVtcGxhdGVVcmw6ICdzcmMvdGVtcGxhdGVzL2Jvb2tzLWxpc3QuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnYm9va3NMaXN0J1xuXHRcdH0pXG5cdFx0LndoZW4oJy9ib29rLzpib29rSWQnLCB7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3NyYy90ZW1wbGF0ZXMvYm9va3MtcGFnZS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdib29rc1BhZ2UnXG5cdFx0fSlcblx0XHQub3RoZXJ3aXNlKCcvIy8nKTtcblxuXHQkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdteUludGVyY2VwdG9yJyk7XG5cbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc3JjL3JvdXRlcy9pbmRleC50c1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDEzLjEwLjE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSBcImFuZ3VsYXJcIjtcbmltcG9ydCB7IGdldExvY2FsU3RvcmFnZSwgYnV5Qm9va0luTG9jYWxTdG9yYWdlLCBhZGROZXdDb21tZW50IH0gZnJvbSAnLi4vbW9kZWwvbG9jYWxzdG9yYWdlJztcblxubGV0IGxpYnJhcnlBcHAgPSBhbmd1bGFyLm1vZHVsZSgnbGlicmFyeUFwcCcpO1xuXG5saWJyYXJ5QXBwXG5cdC5mYWN0b3J5KCd0b29sdGlwJywgZnVuY3Rpb24oJHRpbWVvdXQsJHNjZSkge1xuXHRcdGxldCBmYWlsICAgIFx0PSAnPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIHJvbGU9XCJhbGVydFwiPjxzdHJvbmc+T29wcyE8L3N0cm9uZz4gY2FuXFwndCBwb3N0IGRhdGEgdG8gc2VydmVyIS48L2Rpdj4nLFxuXHRcdFx0c3VjY2VzcyBcdD0gJzxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1zdWNjZXNzXCIgcm9sZT1cImFsZXJ0XCI+PHN0cm9uZz5Xb29ob28hPC9zdHJvbmc+IFN1Y2Nlc3NmdWxseSBhZGRlZC48L2Rpdj4nLFxuXHRcdFx0dW5BdmFpbGFibGUgPSAnPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWluZm9cIiByb2xlPVwiYWxlcnRcIj5Tb3JyeSwgdGhpcyBib29rIGlzblxcJ3QgYXZhaWxhYmxlPC9kaXY+Jyxcblx0XHRcdG9yZGVyZWRcdFx0PSAnPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LXN1Y2Nlc3NcIiByb2xlPVwiYWxlcnRcIj48c3Ryb25nPldvb2hvbyE8L3N0cm9uZz4gU3VjY2Vzc2Z1bGx5IG9yZGVyZWQuPC9kaXY+Jztcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y3JlYXRlKCl7XG5cdFx0XHRcdHJldHVybiBhbGVydCgpO1xuXHRcdFx0fSxcblx0XHRcdHVuQXZhaWxhYmxlKCl7XG5cdFx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHVuQXZhaWxhYmxlKTtcblx0XHRcdH0sXG5cdFx0XHRvcmRlcmVkKCl7XG5cdFx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKG9yZGVyZWQpO1xuXHRcdFx0fSxcblx0XHRcdGZhaWwoKXtcblx0XHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoZmFpbCk7XG5cdFx0XHR9LFxuXHRcdFx0c3VjY2Vzcygpe1xuXHRcdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbChzdWNjZXNzKTtcblx0XHRcdH0sXG5cdFx0XHRyZW1vdmUoKSB7XG5cdFx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKCc8cD48L3A+Jyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSlcblx0LmZhY3RvcnkoJ215SW50ZXJjZXB0b3InLCAoKSA9PiB7XG5cdFx0Ly8kbG9nLmRlYnVnKCckbG9nINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDRh9GC0L7QsdGLINC/0L7QutCw0LfQsNGC0Ywg0YfRgtC+INGN0YLQviDRgdGC0LDQvdC00LDRgNGC0L3QsNGPINGE0LDQsdGA0LjQutCwLCDQsiDQutC+0YLQvtGA0YPRjiDQvNC+0LbQvdC+INC40L3QttC10LrRgtC40YLRjCDRgdC10YDQstC40YHRiycpO1xuXHRcdHJldHVybiB7XG5cdFx0XHQncmVxdWVzdCc6IGZ1bmN0aW9uKGNvbmZpZykge1xuXG5cdFx0XHRcdGlmKCBjb25maWcudXJsLmluZGV4T2YoXCIvcG9zdHJldmlld1wiKSA+IC0xKSB7IC8vSW50ZXJjZXB0IFBPU1QgY29tbWVudCAmIHNlbmQgaXQgdG8gTG9jYWxzdG9yYWdlXG5cdFx0XHRcdFx0YWRkTmV3Q29tbWVudChjb25maWcuZGF0YSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gY29uZmlnO1xuXHRcdFx0fSxcblx0XHRcdCdyZXNwb25zZSc6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXG5cdFx0XHRcdGlmKCByZXNwb25zZS5jb25maWcudXJsID09PSAnc3JjL21vZGVsL2Jvb2tzLmpzb24nICYmIHJlc3BvbnNlLmNvbmZpZy5tZXRob2QgPT09IFwiR0VUXCIgKSB7XG5cdFx0XHRcdFx0Ly9JbnRlcmNlcHQgR0VUIGRhdGEgJiBzZW5kIGl0IGZyb20gTG9jYWxzdG9yYWdlXG5cdFx0XHRcdFx0cmVzcG9uc2UuZGF0YSA9IGdldExvY2FsU3RvcmFnZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHRcdFx0fSxcblx0XHRcdCdyZXNwb25zZUVycm9yJzogZnVuY3Rpb24ocmVqZWN0aW9uKSB7XG5cblx0XHRcdFx0aWYgKHJlamVjdGlvbi5jb25maWcudXJsID09PSAnc3JjL21vZGVsL2Jvb2tzLmpzb24nICYmIHJlamVjdGlvbi5jb25maWcubWV0aG9kID09PSBcIlBPU1RcIikge1xuXHRcdFx0XHRcdGJ1eUJvb2tJbkxvY2FsU3RvcmFnZShyZWplY3Rpb24uY29uZmlnLmRhdGEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJlamVjdGlvbjtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcblxuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NyYy9mYWN0b3JpZXMvaW5kZXgudHNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcbmltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSAnYW5ndWxhcic7XG5cbmxldCBsaWJyYXJ5QXBwID0gYW5ndWxhci5tb2R1bGUoJ2xpYnJhcnlBcHAnKTtcblxuLy9sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJvb2tzXCIsIEpTT04uc3RyaW5naWZ5KGJvb2tzKSk7XG4vL2xldCBib29rcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Jvb2tzJykpO1xuXG5cblxubGlicmFyeUFwcC5jb250cm9sbGVyKCdib29rc0xpc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCRodHRwKSB7XG5cblx0JHNjb3BlLmJvb2tzbGlzdCA9IFtdO1xuXG5cdCRodHRwLmdldCgnc3JjL21vZGVsL2Jvb2tzLmpzb24nKS50aGVuKFxuXHRcdCggcmVzcG9uc2UgKSA9PiB7XG5cdFx0XHQkc2NvcGUuYm9va3NsaXN0ID0gcmVzcG9uc2UuZGF0YTtcblx0XHR9LFxuXHRcdCgpID0+IGFsZXJ0KCdjYW5cXCd0IGxvYWQgZGF0YSBmcm9tIHNlcnZlciEnKVxuXHQpO1xuXG5cdCRzY29wZS5nZXRUb3RhbCA9IGZ1bmN0aW9uKCl7XG5cdFx0bGV0IHRvdGFsID0gMDtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgJHNjb3BlLmJvb2tzbGlzdC5sZW5ndGg7IGkrKyl7XG5cdFx0XHR0b3RhbCArPSAkc2NvcGUuYm9va3NsaXN0W2ldLm9yZGVyZWQubGVuZ3RoO1xuXHRcdH1cblx0XHRyZXR1cm4gdG90YWw7XG5cdH1cblxufSk7XG5cbmxpYnJhcnlBcHAuY29udHJvbGxlcignYm9va3NQYWdlJywgW1xuXHQnJHNjb3BlJyxcblx0JyRyb3V0ZVBhcmFtcycsXG5cdCckaHR0cCcsXG5cdCckdGltZW91dCcsXG5cdCckdWliTW9kYWwnLFxuXHQndG9vbHRpcCcsXG5cdGZ1bmN0aW9uICgkc2NvcGUsJHJvdXRlUGFyYW1zLCRodHRwLCR0aW1lb3V0LCR1aWJNb2RhbCx0b29sdGlwKSB7XG5cblx0bGV0IGlkID0gJHJvdXRlUGFyYW1zLmJvb2tJZCxcblx0XHQkY3RybCA9IHRoaXM7XG5cblx0JHNjb3BlLmJvb2sgPSB7fTtcblx0JHNjb3BlLnNoaXBBZHJlc3MgPSAnJztcblxuXHQkaHR0cC5nZXQoJ3NyYy9tb2RlbC9ib29rcy5qc29uJykudGhlbihcblx0XHQvLyDQv9C10YDQtdGF0LLQsNGC0YvQstCw0LXQvCDQuNC90YLQtdGA0YHQtdC/0YLQvtGA0L7QvFxuXHRcdCggcmVzcG9uc2UgKSA9PiB7XG5cdFx0XHQkc2NvcGUuYm9vayA9IHJlc3BvbnNlLmRhdGFbaWRdO1xuXHRcdFx0JHNjb3BlLmNvdW50UmF0aW5nKCk7XG5cdFx0fSxcblx0XHQoKSA9PiBhbGVydCgnY2FuXFwndCBsb2FkIGRhdGEgZnJvbSBzZXJ2ZXIhJylcblx0KTtcblxuXHQkc2NvcGUuY291bnRSYXRpbmcgPSAoKSA9PiB7XG5cdFx0JHNjb3BlLmFsbFJhdGluZyA9IDA7XG5cdFx0aWYgKCRzY29wZS5ib29rLnJldmlld3MgJiYgJHNjb3BlLmJvb2sucmV2aWV3cy5sZW5ndGgpIHtcblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuYm9vay5yZXZpZXdzLCBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0JHNjb3BlLmFsbFJhdGluZyArPSB2YWx1ZS5zdGFycztcblx0XHRcdH0pO1xuXHRcdFx0JHNjb3BlLmFsbFJhdGluZyA9ICgkc2NvcGUuYWxsUmF0aW5nIC8gJHNjb3BlLmJvb2sucmV2aWV3cy5sZW5ndGgpLnRvRml4ZWQoMSk7XG5cdFx0fVxuXHRcdHJldHVybiAkc2NvcGUuYWxsUmF0aW5nO1xuXHR9O1xuXG5cdCRzY29wZS5vcmRlckJvb2sgPSAoKSA9PiB7XG5cdFx0JHNjb3BlLmJvb2suaXNBdmFpbGFibGUgPyAkc2NvcGUubW9kYWxPcGVuKCkgOiAkc2NvcGUucmVqZWN0T3JkZXIoKTtcblx0fTtcblxuXHQkc2NvcGUucmVqZWN0T3JkZXIgPSAoKSA9PiB7XG5cdFx0JHNjb3BlLlNlcnZlclJlc3BvbnNlID0gdG9vbHRpcC51bkF2YWlsYWJsZSgpO1xuXHRcdCR0aW1lb3V0KCgpID0+IHtcblx0XHRcdCRzY29wZS5TZXJ2ZXJSZXNwb25zZSA9IHRvb2x0aXAucmVtb3ZlKCk7XG5cdFx0fSw0MDAwKTtcblx0fTtcblxuXHQkc2NvcGUubW9kYWxPcGVuID0gKCkgPT4ge1xuXHRcdHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe1xuXHRcdFx0YW5pbWF0aW9uOiB0cnVlLFxuXHRcdFx0YXJpYUxhYmVsbGVkQnk6ICdtb2RhbC10aXRsZScsXG5cdFx0XHRhcmlhRGVzY3JpYmVkQnk6ICdtb2RhbC1ib2R5Jyxcblx0XHRcdHRlbXBsYXRlVXJsOiAnbXlNb2RhbENvbnRlbnQuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnTW9kYWxJbnN0YW5jZUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnJGN0cmwnLFxuXHRcdFx0c2l6ZTogJ3NtJyxcblx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0dGl0bGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gJHNjb3BlLmJvb2sudGl0bGVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0bW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoaW5wdXREYXRhKSB7XG5cdFx0XHQkc2NvcGUuYm9vay5zaGlwQWRyZXNzID0gaW5wdXREYXRhO1xuXHRcdFx0JHNjb3BlLnNlbmRPcmRlcigpO1xuXHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vJGxvZy5pbmZvKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcblx0XHR9KTtcblx0fTtcblxuXHQkc2NvcGUuc2VuZE9yZGVyID0gKCkgPT4ge1xuXG5cdFx0bGV0IGRhdGEgPSAkc2NvcGUuYm9vaztcblxuXHRcdCRodHRwLnBvc3QoJ3NyYy9tb2RlbC9ib29rcy5qc29uJywgZGF0YSkudGhlbiggKHJlc3BvbnNlKSA9PiB7XG5cblx0XHRcdCRzY29wZS5TZXJ2ZXJSZXNwb25zZSA9IHRvb2x0aXAub3JkZXJlZCgpO1xuXHRcdFx0JHNjb3BlLmJvb2sub3JkZXJlZC5sZW5ndGggKz0gMTtcblxuXHRcdFx0Ly8kcm9vdFNjb3BlLiRlbWl0KFwiQ2FsbFBhcmVudE1ldGhvZFwiLCB7fSk7XG5cblx0XHR9LCAoKSA9PiB7XG5cdFx0XHQkc2NvcGUuU2VydmVyUmVzcG9uc2UgPSB0b29sdGlwLmZhaWwoKTtcblx0XHR9KTtcblx0XHQkdGltZW91dCgoKSA9PiB7XG5cdFx0XHQkc2NvcGUuU2VydmVyUmVzcG9uc2UgPSB0b29sdGlwLnJlbW92ZSgpO1xuXHRcdH0sNDAwMCk7XG5cdH07XG5cbn1dKTtcblxubGlicmFyeUFwcC5jb250cm9sbGVyKCdNb2RhbEluc3RhbmNlQ3RybCcsIGZ1bmN0aW9uICgkdWliTW9kYWxJbnN0YW5jZSwkc2NvcGUpIHtcblxuXHRsZXQgJGN0cmwgPSB0aGlzO1xuXG5cdCRzY29wZS5kYXRhID0ge1xuXHRcdHNoaXBBZHJlc3MgOiAnJ1xuXHR9O1xuXG5cdCRjdHJsLm9rID0gZnVuY3Rpb24gKCkge1xuXHRcdCR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5kYXRhLnNoaXBBZHJlc3MpO1xuXHR9O1xuXG5cdCRjdHJsLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcblx0XHQkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcblx0fTtcblxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FwcC9zcmMvY29udHJvbGxlcnMvaW5kZXgudHNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJyZXF1aXJlKCcuL2hlYWRlcicpO1xucmVxdWlyZSgnLi9mb290ZXInKTtcbnJlcXVpcmUoJy4vYXNpZGUnKTtcbnJlcXVpcmUoJy4vcmV2aWV3cycpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc3JjL2RpcmVjdGl2ZXMvaW5kZXgudHNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG5cdHZhciBsaWJyYXJ5QXBwID0gYW5ndWxhci5tb2R1bGUoJ3BhZ2VIZWFkZXInLFtdKTtcblx0bGlicmFyeUFwcC5kaXJlY3RpdmUoJ3BhZ2VIZWFkZXInLGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdBJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAnc3JjL2RpcmVjdGl2ZXMvaGVhZGVyL2hlYWRlclZpZXcuaHRtbCdcblx0XHR9XG5cdH0pO1xufSkoKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NyYy9kaXJlY3RpdmVzL2hlYWRlci9pbmRleC50c1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIihmdW5jdGlvbigpIHtcblx0dmFyIGxpYnJhcnlBcHAgPSBhbmd1bGFyLm1vZHVsZSgncGFnZUZvb3RlcicsW10pO1xuXHRsaWJyYXJ5QXBwLmRpcmVjdGl2ZSgncGFnZUZvb3RlcicsZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0EnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICdzcmMvZGlyZWN0aXZlcy9mb290ZXIvZm9vdGVyVmlldy5odG1sJ1xuXHRcdH1cblx0fSk7XG59KSgpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hcHAvc3JjL2RpcmVjdGl2ZXMvZm9vdGVyL2luZGV4LnRzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiKGZ1bmN0aW9uKCkge1xuXHR2YXIgbGlicmFyeUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdwYWdlQXNpZGUnLFtdKTtcblx0bGlicmFyeUFwcC5kaXJlY3RpdmUoJ3BhZ2VBc2lkZScsZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0EnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICdzcmMvZGlyZWN0aXZlcy9hc2lkZS9hc2lkZVZpZXcuaHRtbCdcblx0XHR9XG5cdH0pO1xufSkoKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NyYy9kaXJlY3RpdmVzL2FzaWRlL2luZGV4LnRzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBAcGFyYW0ge3tzb21lX3VucmVzX3ZhcjpzdHJpbmd9fSBkYXRhXG4gKi9cbihmdW5jdGlvbigpIHtcblx0dmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZXZpZXdzJyxbXSk7XG5cdGFwcC5kaXJlY3RpdmUoJ3Jldmlld3MnLGZ1bmN0aW9uICgkaHR0cCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0c2l0ZU1vZHVsZTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdGNvbnRyb2xsZXJBczogJyRjdHJsJyxcblx0XHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsJHRpbWVvdXQsdG9vbHRpcCkge1xuXG5cdFx0XHRcdHZhciAkY3RybCA9IHRoaXM7XG5cblx0XHRcdFx0JHNjb3BlLnJldmlldyA9IHt9O1xuXG5cdFx0XHRcdCRzY29wZS5hZGRSZXZpZXcgPSBmdW5jdGlvbihyZXZpZXdGb3JtKXtcblxuXHRcdFx0XHRcdHRoaXMucmV2aWV3LmNyZWF0ZWRPbiA9IERhdGUubm93KCk7XG5cblx0XHRcdFx0XHRsZXQgcGFnZUlkID0gJGN0cmwuc2l0ZU1vZHVsZS5pZCxcblx0XHRcdFx0XHRcdG1vZHVsZU5hbWUgPSAkY3RybC5zaXRlTW9kdWxlLm1vZHVsZU5hbWUsXG5cdFx0XHRcdFx0XHRkYXRhID0ge1xuXHRcdFx0XHRcdFx0XHRtb2R1bGVOYW1lOiBtb2R1bGVOYW1lLFxuXHRcdFx0XHRcdFx0XHRwYWdlSWQgOiBwYWdlSWQsXG5cdFx0XHRcdFx0XHRcdHJldmlldyA6IHRoaXMucmV2aWV3XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0JGh0dHAucG9zdChgLyR7bW9kdWxlTmFtZX0vJHtwYWdlSWR9L3Bvc3RyZXZpZXdgLCBkYXRhKS50aGVuKFxuXHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHQkY3RybC5zaXRlTW9kdWxlLnJldmlld3MucHVzaCh0aGlzLnJldmlldyk7XG5cdFx0XHRcdFx0XHRcdCRzY29wZS5yZXZpZXcgPSB7fTtcblx0XHRcdFx0XHRcdFx0cmV2aWV3Rm9ybS4kc2V0UHJpc3RpbmUoKTtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLlNlcnZlclJlc3BvbnNlID0gdG9vbHRpcC5zdWNjZXNzKCk7XG5cdFx0XHRcdFx0XHRcdHR5cGVvZiAkc2NvcGUuJHBhcmVudC5jb3VudFJhdGluZyA9PT0gJ2Z1bmN0aW9uJyAmJiAkc2NvcGUuJHBhcmVudC5jb3VudFJhdGluZygpO1xuXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0JHNjb3BlLlNlcnZlclJlc3BvbnNlID0gdG9vbHRpcC5mYWlsKCk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHQkdGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHQkc2NvcGUuU2VydmVyUmVzcG9uc2UgPSB0b29sdGlwLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH0sNDAwMCk7XG5cblx0XHRcdFx0fTtcblxuXHRcdFx0fSxcblx0XHRcdHRlbXBsYXRlVXJsOiAnc3JjL2RpcmVjdGl2ZXMvcmV2aWV3cy9yZXZpZXcuaHRtbCdcblx0XHR9XG5cdH0pO1xufSkoKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXBwL3NyYy9kaXJlY3RpdmVzL3Jldmlld3MvaW5kZXgudHNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzFJQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OzsiLCJzb3VyY2VSb290IjoiIn0=