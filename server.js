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
app.get('/submit', function (req, res) {
  res.render('submit')
});
app.get('/contact', function (req, res) {
  res.render('contact')
});
app.get('/about', function (req, res) {
  res.render('about')
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
