var express = require('express')
var logger = require('morgan')
var app = express()

app.use(logger('dev'))
app.use(express.static('static'))
app.set('view engine', 'pug')
app.set('views', './source/templates')

app.get('/', function(req, res) {
  res.render('homepage')
})
app.get('/contact', function (req, res) {
  res.render('contact')
})
app.get('/submit', function (req, res) {
  res.render('submit')
})

// parameter middleware that will run before the next routes
app.param('matchid', function(req, res, next, matchid) {

  // run python script to get match data and upload to elasticsearch
  var output

  const { exec } = require('child_process')
  exec('python3 api-actions.py "'+ matchid +'"', (err, stdout, stderr) => {
    if (err) output = err
    else output = stdout
    console.log(output)
    res.locals.matchid = matchid
    res.locals.output = output
    next()
  })
})

app.get('/match/:matchid', function(req, res) {
    res.render('match', { matchid: res.locals.matchid, output: res.locals.output })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
