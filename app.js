
const express = require('express');
const path = require('path');

const app = express();

//load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
  res.render('index');
})

module.exports = app;