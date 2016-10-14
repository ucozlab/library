/**
 * Created by user on 13.10.16.
 */
'use strict';
var angular = require('angular');
var libraryApp = angular.module('libraryApp');
//localStorage.setItem("books", JSON.stringify(books));
//let books = JSON.parse(localStorage.getItem('books'));
var books = [
    {
        id: 0,
        title: 'Empire of the Sun',
        author: 'J. G. Ballard',
        image: 'https://images-na.ssl-images-amazon.com/images/I/51bDdAkWnPL._SX324_BO1,204,203,200_.jpg',
        description: 'The classic, heartrending story of a British boy’s four year ordeal in a Japanese prison camp during the Second World War. Newly reissued with an introduction by John Lanchester.\
		Based on J. G. Ballard’s own childhood, this is the extraordinary account of a boy’s life in Japanese-occupied wartime Shanghai – a mesmerising, hypnotically compelling novel of war, of starvation and survival, of internment camps and death marches. It blends searing honesty with an almost hallucinatory vision of a world thrown utterly out of joint.',
        price: 8.99,
        pageCount: 352,
        isAvailable: true,
        rating: 20,
        ordered: 30,
        reviews: [{
                stars: 5,
                body: "I love this book!",
                author: "joe@example.org",
                createdOn: 1397490980837
            }, {
                stars: 1,
                body: "This book sucks.",
                author: "tim@example.org",
                createdOn: 1397490980837
            }]
    },
    {
        id: 1,
        title: 'The Lord of the Rings (7 book)',
        author: 'J.R.R. Tolkien',
        image: 'https://images-na.ssl-images-amazon.com/images/I/31aaOSA4JlL._BO1,204,203,200_.jpg',
        description: 'Continuing the story of The Hobbit, this seven-volume paperback boxed set of Tolkien’s epic masterpiece, The Lord of the Rings is a collection to treasure.\
		Sauron, the Dark Lord, has gathered to him all the Rings of Power; the means by which he intends to rule Middle-earth. All he lacks in his plans for dominion is the One Ring – the ring that rules them all – which has fallen into the hands of the hobbit, Bilbo Baggins.',
        price: 24.99,
        pageCount: 860,
        isAvailable: true,
        rating: 100,
        ordered: 130,
        comments: 0
    },
    {
        id: 2,
        title: 'The Drowned World',
        author: 'J. G. Ballard',
        image: 'https://images-na.ssl-images-amazon.com/images/I/51e-SIgMloL._SX322_BO1,204,203,200_.jpg',
        description: 'The classic, heartrending story of a British boy’s four year ordeal in a Japanese prison camp during the Second World War. Newly reissued with an introduction by John Lanchester.\
		Based on J. G. Ballard’s own childhood, this is the extraordinary account of a boy’s life in Japanese-occupied wartime Shanghai – a mesmerising, hypnotically compelling novel of war, of starvation and survival, of internment camps and death marches. It blends searing honesty with an almost hallucinatory vision of a world thrown utterly out of joint.',
        price: 8.99,
        pageCount: 176,
        isAvailable: true,
        rating: 20,
        ordered: 30,
        comments: 0
    }
];
libraryApp.controller('booksList', function ($scope) {
    $scope.bookslist = books;
});
libraryApp.controller('booksPage', function ($scope, $routeParams, $http, $httpProvider) {
    var id = $routeParams.bookId;
    $scope.book = books[id];
    $scope.orderBook = function () {
        //books[id].isAvailable ? sendOrder($event) : rejectOrder()
        var data = 5;
        $http.post('http://localhost:8080/#/book/0', data).then(function () {
            alert('success');
            $scope.hello = data;
        }, function () { return alert('Oops'); });
    };
});
libraryApp.controller('orderBook', function ($scope) {
});
//# sourceMappingURL=index.js.map