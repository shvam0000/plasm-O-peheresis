const express = require('express')
const app = express()
const bodyParser = require('body-parser')
//const MongoClient = require('mongodb').MongoClient

function createdb(){
	const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://Hack:hackathon@database.y1m2l.mongodb.net/DATABASE?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
	client.connect(err => {
	const collection = client.db("test").collection("devices");
	client.close();
});
}

var db
/*
MongoClient.connect("mongodb://localhost:27017/ToDoList", { useNewUrlParser: true, useUnifiedTopology: true }, (err, database) => {
    if (err) return console.log(err)
    db = database.db('SignUp')
    app.listen(process.env.PORT || 3000, () => {
        console.log('listening on 3000');
    })
})
*/
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    db.collection('data').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('login.ejs', { quotes: result })
    })
})

app.post('/data', (req, res) => {
    db.collection('data').findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
        if (err) {
            return console.log(err);
            //return res.status(500).send();
        }
        if (!result) {
            console.log('Username and password fault')
			res.redirect('/')
			alert('No Such Account Found')
        }
        else {
            console.log(req.body.Username + ' was found')
            res.render('account.ejs')
            return res.send()
        }
    })
})