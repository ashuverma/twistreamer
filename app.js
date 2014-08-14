#!/bin/env node

var Twistreamer = require('./server/twistreamer')

var app = new Twistreamer();
app.initialize();
app.start();