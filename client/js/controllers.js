/**
 * Main Controller
 */
angular.module('Twistreamer.controllers')
	.controller('AppCtrl', ['$scope', '$interval', 'StreamingService',
		function($scope, $interval, StreamingService) {

		$scope.data = StreamingService.data;

		$scope.keywords = '';
		$scope.showResults = false;
		
		$scope.stream = function() {
			StreamingService.getTweets($scope.keywords);
            $scope.showResults = true;
		};

		$scope.addMoreTweets = function() {
            $scope.data.loadingNextPage = true;
			StreamingService.updateData();
		}


		$scope.chartConfig = $scope.data.chartConfig;
}]);