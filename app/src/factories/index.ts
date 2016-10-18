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


