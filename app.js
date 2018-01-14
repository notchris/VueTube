const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const search = require('youtube-search')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

var opts = {
  maxResults: 10,
  key: '' // YouTube Data API Access Token
};

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.post('/search', function(req, res) {
    search(req.body.term, opts, function(err, results) {
      if(err) return console.log(err);
      res.send(results);
    });
});

app.listen(5000, function() {
    console.log('Running on port 5000')
});
