var Twitter = require('ntwitter')
	, _ = require('underscore')

module.exports = exports = function(app, config, cb) {
	var http = require('http').Server(app)
		, io = require('socket.io')(http)

	//Connection to twitter
	var twit = new Twitter({
		consumer_key : config.auth.twitter.consumerKey,
		consumer_secret: config.auth.twitter.consumerSecret,
		access_token_key: config.auth.twitter.accessToken,
		access_token_secret: config.auth.twitter.accessSecret
	})

	//clients and their keywords
	var clients = {}

	//counters for keywords to track
	var keywords = []
		, keywordCounter = {}

	//store the currentStream and destroy it on new connection (Twitter one connection policy)
	var currentStream

	/**
	 * Add new keywords to list of tracking keywords
	 * @param {[type]} currentKeywords keywords searched by a particular user 
	 */
	function addKeywords(currentKeywords) {
		console.log('Add keyword : ' + currentKeywords)

		_.each(currentKeywords, function(keyword) {
			keyword = keyword.toLowerCase()
			if (keywords.indexOf(keyword) === -1) {
				keywords.push(keyword)
				keywordCounter[keyword] = 0
			}
		})
	}

	/**
	 * Remove keywords from tracking list on disconnection
	 * @param  {[type]} currentKeywords keywords searched by a particular user
	 */
	function removeKeywords(currentKeywords) {
		console.log('remove keywords :' + currentKeywords)

		_.each(currentKeywords, function(keyword) {
			keyword = keyword.toLowerCase()
			var index = keywords.indexOf(keyword)
			if ( index !== -1) {
				keywords.splice(index, 1)
				delete keywordCounter[keyword]
			}
		})
	}

	/**
	 * Send the required info from tweet not full tweet object.
	 * @param  {[type]} tweet [description]
	 * @return {[type]}       [description]
	 */
	function preProcess(tweet) {
		return {
			text: tweet.text
		}
	}

	/**
	 * Start tracking the list of keywords
	 * @param  {[type]} socket [description]
	 * @return {[type]}        [description]
	 */
	function startTracking() {
		console.log('Calling start tracking : ' + keywords)
		if (keywords.length < 1 || keywords.length > 400 ) { 
			console.error("startTracking: Empty keywords");
			return 
		}

		twit.stream('statuses/filter', { track : keywords.join(',')}, function(stream) {

				//save stream instance for stopping
				currentStream = stream

				// look for data
				stream.on('data', function(tweet) {

					//update keywordsord count
					_.each(keywords, function(keyword) {
						keyword = keyword.toLowerCase()
						if (tweet.text.indexOf(keyword) !== -1) { // match keywords in tweet
							keywordCounter[keyword]++;
							io.in(keyword).emit('tweet', tweet)
						}	
					})
				})

				stream.on('error', function(err, status, a, b) {
					console.log(arguments);
				})

				
			})
	}


	io.on('connection', function(socket) {
		console.log('New Connection : ' + socket.id);

		//empty keyword list on connection.
		clients[socket.id] = []

		//Search handler. Handles the query frm user
		socket.on('search', function(query) {
			console.log('Search request from ' + socket.id + ' : ' + query)

			// stop the current stream and create a new connection.
			if (currentStream !== undefined) {
				console.log("stoping stream");
				currentStream.destroy()
				removeKeywords(clients[socket.id])
			}

			currentKeywords = query.data.split(/[\s,]+/)
			clients[socket.id] = currentKeywords

			//subscribe to rooms
			_.each(currentKeywords, function(keyword) {
				socket.join(keyword)
			})

			// update tracking keyword list
			addKeywords(currentKeywords)

			startTracking()

		})


		socket.on('disconnect', function() {
			if (currentStream !== undefined) {
				console.log("stoping stream");
				currentStream.destroy()
				removeKeywords(clients[socket.id])
				delete clients[socket.id]
				startTracking()
			}
            console.log('Disconnect id : ' + socket.id + '@ ' + new Date());
		})
	})

	//send the keyword counts for the query at every 10 sec.				
	setInterval(function() {
	
		var data = {}
		_.each(keywords, function(keyword) {
			keyword = keyword.toLowerCase()
			data.keyword = keyword
			data.count = keywordCounter[keyword]
			data.timestamp = Date.now()
			io.to(keyword).emit('counts', data)
			keywordCounter[keyword] = 0
			data = {}
		})

	}, 1000 * 10)

  cb(http)
}