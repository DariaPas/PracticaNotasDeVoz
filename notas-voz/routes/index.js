var express = require('express');
var router = express.Router();

const {MongoClient} = require("mongodb");

const connection_string = 'mongodb://127.0.0.1:27017/'
const client = new MongoClient(connection_string)


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


var session = require('express-session');
// const MongoStore = require('connect-mongo')(session);

// Use the session middleware
router.use(session({
  secret: 'clavesecretaparaexpresss',
  saveUninitialized: true, // create session even if there is nothing stored
  resave: true, // save session even if unmodified
  cookie: { maxAge: 60 * 60 * 1000 },
 // store: new MongoStore({ url: 'mongodb://127.0.0.1:27017/test-app'})
}));


router.get('/',(req,res) => {
  if(req.session.email) {
    return res.redirect('/admin');
  }
  res.render('index', { title : 'title'});
});

router.get('/login', (req, res) => {
  res.render('login', {title: 'Hello world'})
})


router.post('/login',  async (req,res) => {

  req.session.email = req.body.email;
  req.session.password = req.body.password 

  try {
    conn = await client.connect();
  } catch(e) {
     console.error(e);
  }

  let db = conn.db("grabaciones");

  let collection = await db.collection("user");
  let user = await collection.find({email: req.body.email}).toArray()

  if(JSON.stringify(user) == '[]') res.end(JSON.stringify({status: false, msg: 'The user you are trying to get loged in does not exist'}))
  if(user[0].password != req.body.password) res.end(JSON.stringify({status: false, msg: 'The password does not match'})) 


  res.end(JSON.stringify({status: true, msg: 'OK'}));
})


router.get('/admin',(req,res) => {
  if(req.session.email) {
    res.write(`<h1>Hello ${req.session.email} </h1><br>`);
    res.end('<a href='+'/logout'+'>Logout</a>');
  }
  else {
    res.write('<h1>Please login first.</h1>');
    res.end('<a href='+'/'+'>Login</a>');
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });

});


// ------------------------------------
//       Mongo DB Voice Message Logic
// ------------------------------------


router.get('/api/list/:id', async (req, res) => {  
  const user_id = req.params.id
  console.log('user_id', user_id)
  const file_list = await handel_list(user_id)

  file_list.forEach(file => {
    res.write('<h1>' + file.filename + '.</h1>');
  })
})

const handel_list = async (id) => {
  let list = []

  try {
    conn = await client.connect();
  } catch(e) {
     console.error(e);
  }

  let db = conn.db("grabaciones")

  let collection = await db.collection("files");
  const item_list = await collection.find({}).toArray()

  list = item_list.filter(item => item.id === id)

  const compareByTimestamp = (a, b) => a.date - b.date;

  list = list.sort(compareByTimestamp)

  return list
} 

router.get('/api/play/:filename', async (req, res, next) => {
  const file_name = req.params.filename 

  try {
    conn = await client.connect();
  } catch(e) {
     console.error(e);
  }

  let db = conn.db("grabaciones")

  let collection = await db.collection("files");
  const searching_file = await collection.find({filename: file_name}).toArray()

  if(JSON.stringify(searching_file) == '[]') res.status(404).end('Filename not found')

  const file = searching_file.pop() 

  console.log(file.file)

  // Update to current date

  const current_date = new Date().getTime()
  const modification_count = collection.updateOne( { filename: file_name }, { $set: { date: current_date } })

  res.render('play_audio', {audio_src: file.file })

  if(modification_count <= 0) res.end('<h1> Unsucseffully updated date </h1>')
  else console.log('Load files')
  


})

module.exports = router;
