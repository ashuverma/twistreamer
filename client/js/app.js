window.app = angular.module('Twistreamer', [
	'ngSanitize',
	'ngRoute',
	'ngAnimate',
	'Twistreamer.services',
	'Twistreamer.controllers',
	'Twistreamer.directives',
	'infinite-scroll',
	'highcharts-ng'
]);

angular.module('Twistreamer.controllers', []);
angular.module('Twistreamer.services', []);
angular.module('Twistreamer.directives', []);


angular.element(document).ready(function(){
	angular.bootstrap(document, ['Twistreamer']);
});


/**
 * Angular application routing
 */

angular.module('Twistreamer').config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/', {
			templateUrl : 'views/index.html'
		}).
		otherwise({redirectTo: '/'});
}])

//Setting HTML5 Location Mode
angular.module('Twistreamer').config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
}]);

