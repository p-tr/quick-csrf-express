const express = require('express');
const { randomBytes } = require('crypto');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const secret = process.env.APP_KEY || 'ChangeMe!';

app.set('view engine', 'ejs');

app.use(session({
  cookie: {
    httpOnly: true,
    sameSite: true
  },
  secret,
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/csrf', (req, res) => {
  const token = randomBytes(64).toString('hex');
  req.session.token = token;
  res.render('csrf', { token });
});

app.post('/csrf', (req, res) => {
  if(req.session.token && req.body.token &&
    req.session.token == req.body.token) {
    console.log('CSRF validation passed !');
    res.redirect('/');
  } else {
    console.log('CSRF validation failed !');
    res.sendStatus(403);
  }
});

app.listen(8080, () => {
  console.log(`Listening on :8080...`);
});
