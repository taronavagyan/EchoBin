const config = require('./config')
const express = require('express');
const morgan = require('morgan');
const crypto = require('crypto')
const mongo = require('./lib/mongodb-query');
const app = express();
const port = config.PORT;
const host = config.HOST;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.rawHeaders)
  console.log(req.method);
  console.log(req.url);
  console.log(req.body);
  mongo.insertOne('test', 'requests_collection', req.body)
  res.sendStatus(200);
});

//Create new bin
app.post('/createBin', (req, res) => {
  let binPath = crypto.randomBytes(10).toString('hex');
  //e.g. binPath is a string - e.g. 40a65c27d6c4a79e

  //TODO store pinPath into postgres
  res.redirect(`/bin/${binPath}`)
});

app.get('/', (req, res) => {
  //DB query to get all bins
  console.log(req);
  let allBins = ['bin 1', 'bin 2', 'bin 3'];
  res.render('homepage', {allBins})
});

app.get('/bin/:bin_path', (req, res) => {
  const binPath = req.params.bin_path;
  
  //DB query to get all requests with bin id 
  let allRequests = ['request 1', 'request 2', 'request 3'];

  res.render('bin', {binPath, allRequests})
});

app.listen(port, host, () => {
  console.log(`Server is running on port: ${port} of ${host}`);
});