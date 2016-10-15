/**
 * Created by user on 13.10.16.
 */
'use strict';

import * as angular from "angular";

let libraryApp = angular.module('libraryApp');

libraryApp.factory('myInterceptor', () => {
	//$log.debug('$log используется чтобы показать что это стандартная фабрика, в которую можно инжектить сервисы');
	return {
		'request': function(config) {
			console.log('request: ');
			console.dir(config);
			return config;
		},
		'response': function (response) {
			console.log('response: ');
			console.dir(response);
			return response;
		},
		'responseError': function(rejection) {
			console.log('rejection: ');
			console.dir(rejection);
			return rejection;
		}
	};
});


