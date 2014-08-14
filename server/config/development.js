
var path = require('path')

//Auth related config
var auth = {
    twitter : {
        consumerKey    : '6T1afIftQ4MR6mRHLef5KXbfx',
        consumerSecret : '1bOxBtGH2YCG8kAog44b8wmlvW25KEnUZ23T5muzJ5T1IJTKT5',
        accessToken    :'149797514-fKMNaWBPovPohXpzwL6XDkbUNNX7jbJKZPI8onK1',
        accessSecret   : 'BcnnVtgB5D8mbmB0M9GihWwpsi1i5Of0p8GHu2p5jdDzI'
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