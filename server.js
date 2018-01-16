var express = require('express')
  , logger = require('morgan')
  , app = express()

app.use(logger('dev'))
app.set('view engine', 'jade')
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
