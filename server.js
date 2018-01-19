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

app.get('/', function(req, res) {
  res.render('homepage')
})
app.get('/contact', function(req, res) {
  res.render('contact')
})
app.get('/submit', recaptcha.middleware.render, function(req, res) {
  res.render('submit', { captcha:res.recaptcha })
})
app.post('/match', recaptcha.middleware.verify, function(req, res) {
  // run python script to get match data and upload to elasticsearch
  var matchid = req.body.matchid
  var output = ''
  const { exec } = require('child_process')
    exec('python3 api-actions.py "'+ matchid +'"', (err, stdout, stderr) => {
    if (err) output = err
    else output = stdout
    console.log(output)
  })
  res.render('/match', { matchid: matchid, output: output, error:req.recaptcha.error, data:JSON.stringify(req.recaptcha.data) })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
