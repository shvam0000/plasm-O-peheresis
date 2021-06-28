const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const multer = require('multer');

require('dotenv').configure();

const MongoClient = require('mongodb').MongoClient;

var db;

var user = null;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

const uri = `mongodb+srv://Hack:${process.env.MONGODB_PW}@database.y1m2l.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  db = client.db('test');
  console.log('connected');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on 3000');
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/faq', (req, res) => {
  res.render('faq');
});

/*app.get('/account', (req, res) => {
    res.render("account");
})*/

app.get('/login', (req, res) => {
  res.render('login', { x: '' });
});

app.get('/contact', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('index');
});

app.get('/account', (req, res) => {
  /*    if (!user) {
        res.redirect('/login')
        return console.log('Not logged in');
    }*/
  db.collection('items')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      // console.log(result)
      res.render('account', {
        items: result,
      });
    });
});

app.post('/signup', (req, res) => {
  db.collection('signup').save(req.body, (err, result) => {
    if (err) {
      res.redirect('/signup');
      console.log(err);
    }
    console.log('saved to database');
    res.redirect('/login');
  });
});

app.post('/logindata', (req, res) => {
  db.collection('signup').findOne(
    { username: req.body.username, password: req.body.password },
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      if (!result) {
        res.render('login', { x: 'Username or password fault' });
        res.end();
        return console.log('Username or password fault');
      } else {
        user = req.body.username;
        console.log(req.body.username + ' was loggedIn successfully!');
        res.redirect('/account');
        return res.send();
      }
    }
  );
});
app.post('/add', (req, res) => {
  db.collection('items').insertOne(req.body.item, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      console.log(result);
      res.redirect('/account');
    }
  });
});

app.post('/logout', (req, res) => {
  user = null;
  res.redirect('/login');
});

client.close();
