
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

	let $ctrl = this;

	$scope.book = {};
	$scope.id = +$routeParams.bookId;
	$scope.moduleName = 'book';
	$scope.shipAdress = '';

	$http.get('src/model/books.json').then(
		// перехватываем интерсептором
		( response ) => {
			$scope.book = response.data[$scope.id];
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

	$scope.order = () => {
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
		data.id = $scope.id;
		data.moduleName = $scope.moduleName;

		$http.post(`/${data.moduleName}/${data.id}/order`, data).then( (response) => {

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

libraryApp.controller('audioList', function ($scope,$http) {

	$scope.audiolist = [];

	$http.get('src/model/audio.json').then(
		( response ) => {
			$scope.audiolist = response.data;
		},
		() => alert('can\'t load data from server!')
	);

	$scope.getTotal = function(){
		let total = 0;
		for(let i = 0; i < $scope.audiolist.length; i++){
			total += $scope.audiolist[i].ordered.length;
		}
		return total;
	}

});

libraryApp.controller('audioPage', [
	'$scope',
	'$routeParams',
	'$http',
	'$timeout',
	'$uibModal',
	'tooltip',
	function ($scope,$routeParams,$http,$timeout,$uibModal,tooltip) {

		let $ctrl = this;

		$scope.audio = {};
		$scope.id = +$routeParams.audioId;
		$scope.moduleName = 'audio';
		$scope.shipAdress = '';

		$http.get('src/model/audio.json').then(
			// перехватываем интерсептором
			( response ) => {
				$scope.audio = response.data[$scope.id];
				$scope.countRating();
			},
			() => alert('can\'t load data from server!')
		);

		$scope.countRating = () => {
			$scope.allRating = 0;
			if ($scope.audio.reviews && $scope.audio.reviews.length) {
				angular.forEach($scope.audio.reviews, function (value) {
					$scope.allRating += value.stars;
				});
				$scope.allRating = ($scope.allRating / $scope.audio.reviews.length).toFixed(1);
			}
			return $scope.allRating;
		};

		$scope.order = () => {
			$scope.audio.isAvailable ? $scope.modalOpen() : $scope.rejectOrder();
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
						return $scope.audio.title
					}
				}
			});

			modalInstance.result.then(function (inputData) {
				$scope.audio.shipAdress = inputData;
				$scope.sendOrder();
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.sendOrder = () => {

			let data = $scope.audio;
			data.id = $scope.id;
			data.moduleName = $scope.moduleName;

			$http.post(`/${data.moduleName}/${data.id}/order`, data).then( (response) => {

				$scope.ServerResponse = tooltip.ordered();
				$scope.audio.ordered.length += 1;

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