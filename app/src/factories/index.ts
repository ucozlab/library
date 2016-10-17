/**
 * Created by user on 13.10.16.
 */
'use strict';

import * as angular from "angular";
import { getLocalStorage, buyBookInLocalStorage, addNewComment } from '../model/localstorage';

let libraryApp = angular.module('libraryApp');

libraryApp
	.factory('Application', function($log) {
		return {};
	})
	.factory('myInterceptor', (Application) => {
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


