var express = require('express')
var logger = require('morgan')
var bodyParser = require('body-parser')
var Recaptcha = require('express-recaptcha')
var recapsite = process.env.recapsite
var recapkey = process.env.recapkey
var recaptcha = new Recaptcha(recapsite, recapkey)
var app = express()

app.use(logger('dev'))
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'pug')
app.set('views', './source/templates')

// Routes
app.get('/', function(req, res) {
  res.render('homepage')
})
app.get('/view', function(req, res) {
  res.render('view')
})
app.get('/faq', function(req, res) {
  res.render('faq')
})
app.get('/contact', function(req, res) {
  res.render('contact')
})
app.get('/submit', recaptcha.middleware.render, function(req, res) {
  res.render('submit', { captcha:res.recaptcha })
})
app.post('/match', recaptcha.middleware.verify, function(req, res) {
  // check captcha
  if (!req.recaptcha.error) {
    var matchid = req.body.matchid
    var output
    var tryagain = "<br><br>Oops! <a href='/submit'>Go back and try again</a>"
    var kibanaurl = "The match should be available at: <a href='http://kibana.mrbcleague.com/app/kibana#/doc/903df740-fc9b-11e7-8668-8986c2dc61ab/mwo/match?id="+matchid+"'>kibana.mrbcleague.com/app/kibana#/doc/903df740-fc9b-11e7-8668-8986c2dc61ab/mwo/match?id="+matchid+"<a/>"

    // run python script to get match data and upload to elasticsearch
    const { exec } = require('child_process')
    exec('python3 api-actions.py "'+ matchid +'"', (err, stdout, stderr) => {
      output = stdout
      console.log(output)
      output = output.replace('Unprocessable Entity', 'Invalid Match ID')
      if(output.toString().indexOf('Success') > -1) output += kibanaurl
      else output += tryagain
      res.render('match', { matchid: matchid, output: output })
    })
  }
  else res.render('submit', { error:req.recaptcha.error })
})

// Run
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
