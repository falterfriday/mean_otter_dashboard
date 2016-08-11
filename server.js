var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// -------------------mongoose-------------------------
mongoose.connect('mongodb://localhost/dashboard');
var OtterSchema = new mongoose.Schema({
	_id: Number,
	name: String,
	color: String
});
mongoose.model('Otter', OtterSchema);
var Otter = mongoose.model('Otter');
//-----------------------------------------------------
app.use(bodyParser.urlencoded({ extended:true}));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//-----------load index & grab-all from db--------------
app.get('/', function(req, res) {
	Otter.find( {} , function(err, otters) {
		if (err) {
			console.log('error');
		} else {
			console.log('found some otters!');
			res.render('index', { otters: otters });
		}
	});
});

//------------new otter page-----------------------------
app.get('/otters/new', function(req, res) {
	res.render('new_otter');
});


//------------create otter form--------------------------
var id_counter = 0;
app.post('/new_otter', function(req, res) {
	console.log("POST DATA", req.body);
	id_counter +=1;
	var otter = new Otter({ _id: id_counter, name: req.body.name, color: req.body.color} );
	otter.save(function(err) {
		if (err){
			console.log('something went wrong');
		} else {
			console.log('successfully added otter');
			return id_counter;
		}
	});
	res.redirect('/');
});
//-------------------------------------------------------

app.listen(8000, function(){
	console.log("listening on port 8000");
});
