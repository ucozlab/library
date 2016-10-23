/**
 * Created by user on 17.10.16.
 */

let defaultStorage = {
	book : [
		{
			"title": "Empire of the Sun",
			"author": "J. G. Ballard",
			"image": "https://images-na.ssl-images-amazon.com/images/I/51bDdAkWnPL._SX324_BO1,204,203,200_.jpg",
			"description": "The classic, heartrending story of a British boy’s four year ordeal in a Japanese prison camp during the Second World War. Newly reissued with an introduction by John Lanchester.Based on J. G. Ballard’s own childhood, this is the extraordinary account of a boy’s life in Japanese-occupied wartime Shanghai – a mesmerising, hypnotically compelling novel of war, of starvation and survival, of internment camps and death marches. It blends searing honesty with an almost hallucinatory vision of a world thrown utterly out of joint.",
			"price": 8.99,
			"pageCount": 352,
			"isAvailable": true,
			"rating": 20,
			"ordered": ["rustavi 27","illina 11","nevskogo 5"],
			"reviews": [
				{
					"stars": 5,
					"body": "I love this book!",
					"author": "joe@example.org",
					"createdOn": 1397490980837
				},
				{
					"stars": 1,
					"body": "This book sucks.",
					"author": "tim@example.org",
					"createdOn": 1397490980837
				}
			]
		},
		{
			"title": "The Lord of the Rings (7 book)",
			"author": "J.R.R. Tolkien",
			"image": "https://images-na.ssl-images-amazon.com/images/I/31aaOSA4JlL._BO1,204,203,200_.jpg",
			"description": "Continuing the story of The Hobbit, this seven-volume paperback boxed set of Tolkien’s epic masterpiece, The Lord of the Rings is a collection to treasure.Sauron, the Dark Lord, has gathered to him all the Rings of Power; the means by which he intends to rule Middle-earth. All he lacks in his plans for dominion is the One Ring – the ring that rules them all – which has fallen into the hands of the hobbit, Bilbo Baggins.",
			"price": 24.99,
			"pageCount": 860,
			"isAvailable": true,
			"rating": 0,
			"ordered": ["rustavi 27","nevskogo 5"],
			"reviews": []
		},
		{
			"title": "The Drowned World",
			"author": "J. G. Ballard",
			"image": "https://images-na.ssl-images-amazon.com/images/I/51e-SIgMloL._SX322_BO1,204,203,200_.jpg",
			"description": "The classic, heartrending story of a British boy’s four year ordeal in a Japanese prison camp during the Second World War. Newly reissued with an introduction by John Lanchester.Based on J. G. Ballard’s own childhood, this is the extraordinary account of a boy’s life in Japanese-occupied wartime Shanghai – a mesmerising, hypnotically compelling novel of war, of starvation and survival, of internment camps and death marches. It blends searing honesty with an almost hallucinatory vision of a world thrown utterly out of joint.",
			"price": 8.99,
			"pageCount": 176,
			"isAvailable": false,
			"rating": 0,
			"ordered": [],
			"reviews": []
		}
	],
	audio: [
		{
			"title": "The War Doctor 3: Agents of Chaos",
			"image": "https://images-na.ssl-images-amazon.com/images/I/61kGkTfQT3L._SY498_BO1,204,203,200_.jpg",
			"price": 19.41,
			"isAvailable": true,
			"ordered": ["rustavi 27","illina 11","nevskogo 5"],
			"reviews": [
				{
					"stars": 5,
					"body": "I love this book!",
					"author": "joe@example.org",
					"createdOn": 1397490980837
				},
				{
					"stars": 1,
					"body": "This book sucks.",
					"author": "tim@example.org",
					"createdOn": 1397490980837
				}
			]
		},
		{
			"title": "A Game of Thrones: A Song of Ice and Fire",
			"image": "https://images-na.ssl-images-amazon.com/images/I/516wgmAPXUL._SX431_BO1,204,203,200_.jpg",
			"price": 20.09,
			"isAvailable": true,
			"ordered": [],
			"reviews": []
		},
		{
			"title": "Island of Glass (Guardians Trilogy)",
			"image": "https://images-na.ssl-images-amazon.com/images/I/51N7AY6Ee2L._SX311_BO1,204,203,200_.jpg",
			"price": 38.99,
			"isAvailable": false,
			"ordered": [],
			"reviews":[]
		},
	]
};

let getModules = () => JSON.parse(localStorage.getItem("modules"));

let getLocalStorage = (string:string) => {

	if(localStorage.getItem("modules") !== null) {
		return getModules()[string];
	} else {
		localStorage.setItem("modules", JSON.stringify(defaultStorage));
		return defaultStorage[string];
	}

};

let buyNewItem = (data) => {

	let storedData = getModules();
	storedData[data.moduleName][data.id].ordered.push(data.shipAdress);
	localStorage.setItem("modules", JSON.stringify(storedData));

};

let addNewComment = (data) => {

	let storedData = getModules();
	storedData[data.moduleName][data.pageId].reviews.push(data.review);
	localStorage.setItem("modules", JSON.stringify(storedData));

};

export { getLocalStorage, buyNewItem, addNewComment };