
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
			total += $scope.bookslist[i].ordered;
		}
		return total;
	}

});

libraryApp.controller('booksPage', ['$scope','$routeParams','$http','$sce','$timeout','myInterceptor', function ($scope,$routeParams,$http,$sce,$timeout) {

	let id = $routeParams.bookId;

	$scope.book = {};

	$http.get('src/model/books.json').then(
		( response ) => {
			$scope.book = response.data[id];
		},
		() => alert('can\'t load data from server!')
	);

	$scope.orderBook = () => {
		$scope.book.isAvailable ? $scope.sendOrder() : $scope.rejectOrder();
	};

	$scope.sendOrder = () => {

		let data = Object.assign({},$scope.book);

		$http.post('src/model/books.json', data).then(()=>{
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

}]);


