var express = require('express')
  , logger = require('morgan')
  , app = express()
  , template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')
  , basedir = 'source/templates/'

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))

app.get('/', function (req, res, next) {
  try {
    var html = template({ title: 'Home' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.get('/submit', function (req, res) {
    var html = require('jade').renderFile(basedir + 'submit.jade')
    res.send(html)
});
app.get('/contact', function (req, res) {
    var html = require('jade').renderFile(basedir + 'contact.jade')
    res.send(html)
});
app.get('/about', function (req, res) {
    var html = require('jade').renderFile(basedir + 'about.jade')
    res.send(html)
});
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
