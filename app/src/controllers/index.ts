
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

libraryApp.controller('booksPage', ['$scope','$routeParams','$http','$sce','$timeout','$uibModal','myInterceptor', function ($scope,$routeParams,$http,$sce,$timeout,$uibModal) {

	let id = $routeParams.bookId,
		$ctrl = this;

	$scope.book = {};
	$scope.shipAdress = '';

	$http.get('src/model/books.json').then(
		// перехватываем интерсептором
		( response ) => {
			$scope.book = response.data[id];
		},
		() => alert('can\'t load data from server!')
	);

	$scope.orderBook = () => {
		$scope.book.isAvailable ? $scope.modalOpen() : $scope.rejectOrder();
	};

	$scope.sendOrder = () => {

		let data = (<any>Object).assign({},$scope.book);

		$http.post('src/model/books.json', data).then((response)=>{
			console.dir(response);
			$scope.ServerResponse = $sce.trustAsHtml('<div class="alert alert-success" role="alert">\
				<strong>Woohoo!</strong> Successfully ordered.\
			</div>');
			$scope.book.ordered += 1;
		}, () => {
			$scope.ServerResponse = $sce.trustAsHtml('<div class="alert alert-danger" role="alert">\
				<strong>Oops!</strong> can\'t post data to server!.\
			</div>');
		});
		$scope.killTooltip();
	};

	$scope.rejectOrder = () => {
		$scope.ServerResponse = $sce.trustAsHtml('<div class="alert alert-info" role="alert">\
				Sorry, this book isn\'t available\
			</div>');
		$scope.killTooltip();
	};

	$scope.killTooltip  = () => {
		$timeout(() => {
			$scope.ServerResponse = $sce.trustAsHtml('<p></p>');
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
//			scope: $scope,
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