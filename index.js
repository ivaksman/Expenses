var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var app = express();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'expenses'
});

connection.connect();



app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat'
}))

app.use(express.static('public'));
/*
app.get('/', function(req, res) {
  if(req.session.lastPage) {
    res.write('Last page was: ' + req.session.lastPage + '. ');
  }

  req.session.lastPage = '/awesome';
  res.send('Your Awesome.');
});
*/
app.get('/login', function(req, res) {
	if(req.query.email==undefined||req.query.password==undefined)
		return;

	connection.query('SELECT * from users where email=\''+req.query.email+'\' and password=\''+req.query.password+'\'', function(err, rows, fields) {
		if (err) throw err;

		if(rows.length == 0) {
			connection.query('SELECT * from users where email=\''+req.query.email+'\'', function(err, rows, fields) {
				if (err) throw err;

				if(rows.length > 0) {
					res.json({ error: 'password incorrect' });
					res.end();
				} else {
					res.json({ error: 'user not found' });
					res.end();
				}
			});
		} else {
			req.session.user = rows[0];
			res.json(rows[0]);
			res.end();
		}
	});
});

app.get('/register', function(req, res) {
	if(req.query.email==undefined||req.query.password==undefined)
		return;

	connection.query('insert into users (email, password) values (\''+req.query.email+'\', \''+req.query.password+'\')', function(err, rows, fields) {
		if (err) throw err;

		connection.query('select * from users where id = \''+rows.insertId+'\'', function(err, rows, fields) {
			if (err) throw err;

			req.session.user = rows[0];
			res.json(rows[0]);
			res.end();
		});
	});
});

app.get('/radical', function(req, res) {
  if(req.session.lastPage) {
    res.write('Last page was: ' + req.session.lastPage + '. ');
  }

  req.session.lastPage = '/radical';
  res.send('What a radical visit!');
});

app.get('/tubular', function(req, res) {
  if(req.session.lastPage) {
    res.write('Last page was: ' + req.session.lastPage + '. ');
  }

  req.session.lastPage = '/tubular';
  res.send('Are you a surfer?');
});

app.listen(process.env.PORT || 8080);