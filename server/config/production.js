
var path = require('path')

//Auth related config
var auth = {
    twitter : {
        consumerKey    : '',
        consumerSecret : '',
        accessToken    :'',
        accessSecret   : ''
    }
}

var paths = {
    root : path.normalize(__dirname + '/../../')
}

paths.static = path.join(paths.root, 'public')

exports = module.exports = {
    auth   : auth,
    paths  : paths
}