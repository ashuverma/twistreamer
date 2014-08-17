/**
 * Angular service for wrapping socket io. connection
 * @return {[type]} 
 */
angular.module('Twistreamer.services').factory('SocketService', ['$rootScope', '$window', function($rootScope, $window) {
	var socket = $window.io();
	return {
	    on: function (eventName, callback) {
    		socket.on(eventName, function () {  
        		var args = arguments;
        		$rootScope.$apply(function () {
	          		callback.apply(socket, args);
        		});
      		});
	    
	    },
	    emit: function (eventName, data, callback) {
	   		socket.emit(eventName, {data:data}, function () {
	        var args = arguments;
	        $rootScope.$apply(function () {
	          if (callback) {
	            callback.apply(socket, args);
	          }
	        });
	      })
	    }
  	};	
}]);

/**
 * Handle Fetching of tweets from server. Controller shouldn't be aware of transport mechanism.
 * @return {[type]} [description]
 */
angular.module('Twistreamer.services').factory('StreamingService', ['SocketService', function(SocketService) {
	var data = {
		tweets: [],
		tweetsToDisplay : [],
		chartConfig :{},
		loadingNextPage: false
	};


	var INITIAL_TWEET_LIMIT = 20
		, TWEET_PER_PAGE_LIMIT = 20


	var previousKeywords = '';

	var index = {};

	
	data.chartConfig = {
	    options: {
	        chart: {
	            type: 'line',
	            animation: Highcharts.svg,
	            marginRight: 10,
				zoomType: 'x',
				height:300
	        }
		},
		title: {
			text: 'Mentions/10sec'
		},
        series: [],
		xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Mentions/ 10 Second'
            },
            min:0,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
	    loading: false,
	    tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        }
    };



	/**
	 * Move tweets from store to display array
	 * @param  {[type]} startIndex [description]
	 * @return {[type]}            [description]
	 */
	

	// counts event handler.
	SocketService.on('counts', function(counts) {
		data.chartConfig.series[index[counts.keyword]].type = 'spline';
		data.chartConfig.series[index[counts.keyword]].data.push([counts.timestamp, counts.count]);
	});

	// tweet handler
	SocketService.on('tweet', function(tweet) {
		// if count is less than intial tweet limit than add to display list also.
		if (data.tweetsToDisplay.length < INITIAL_TWEET_LIMIT ) {
			data.tweetsToDisplay.push(tweet);
		} else {
			data.tweets.push(tweet);
		}
	});

	return {
		data: data,
		getTweets: function (keywords) {
			if (keywords !== previousKeywords) { 	// need to change compare logic. later just check for keywords.
				//reset previous results
				data.tweets = [];
				data.tweetsToDisplay = [];

				//send search query
				SocketService.emit('search', keywords);

				//update previous searched keywords
				previousKeywords = keywords;
				index = {};
				angular.forEach(keywords.split(','), function(val, i) {
					if (data.chartConfig.series[i] === undefined) {
						data.chartConfig.series.push({
							name: val,
							data: []
						});
					} else {
						data.chartConfig.series[i].data = [];
					}
					index[val] = i;
				});
			}
		},
		updateData: function () {
			if (data.tweets.length  < 1 ) { return }

			var arr = data.tweets.splice(0, TWEET_PER_PAGE_LIMIT);
			data.tweetsToDisplay = data.tweetsToDisplay.concat(arr);
			data.loadingNextPage = false;
		}
	}

}]);

