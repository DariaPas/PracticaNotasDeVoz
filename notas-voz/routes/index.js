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


  res.end(JSON.stringify({ status: true, msg: 'OK', username: user[0].name }));
})


router.get('/admin',(req,res) => {
  if(req.session.email) {
    res.write(`<h1>Hello ${req.session.email} </h1><br>`);
    res.end('<a href='+'/logout'+'>Logout</a>');
  }
  else {
    res.write('<h1>Please login first.</h1>');
    res.end('<a href='+'/login'+'>Login</a>');
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/login');
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

router.get('/api/play/:filename', async (req, res) => {
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

  res.render('play_audio', { audio_src: file.file })

  if(modification_count <= 0) res.end('<h1> Unsucseffully updated date </h1>')
  else console.log('Load files')
  
  res.status(200).end(JSON.stringify({status: true}))

})

router.post('/api/upload/:name', async (req, res) => {
  const user_name = req.params.name
  const file_src = req.body.src

  // generate a connection with the databse 
  
  try {
    conn = await client.connect();
  } catch(e) {
     console.error(e);
  }


  function generateRandomString(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
    }
  
    return randomString;
  }
  


  let db = conn.db("grabaciones")
  const collection_users = await db.collection("user");
  const user_arr = await collection_users.find({name: user_name}).toArray()

  if(JSON.stringify(user_arr) == '[]') res.status(401).end('The user you are trying to get files from doees not exist')

  const user_id = user_arr[0].id

  console.log('User Id: ', user_id)

  const collection_file = await db.collection("files");
  const new_file_name = generateRandomString(32)

  const item_list = await collection_file.insertOne({filename: new_file_name, id: user_id, date: new Date().getTime(), file: file_src})

  res.status(200).end(JSON.stringify({status: true, msg: 'OK', filename: new_file_name}))

})

router.post('/api/delete/:username/:filename', async (req, res) => {
    const user_name = req.params.username
    const file_name = req.params.filename

    try {
      conn = await client.connect();
    } catch(e) {
       console.error(e);
    }

    let db = conn.db("grabaciones")
    const collection_users = await db.collection("user");
    const user_arr = await collection_users.find({name: user_name}).toArray()
  
    if(JSON.stringify(user_arr) == '[]') res.status(401).end('The user you are trying to get files from doees not exist')
  
    const user_id = user_arr[0].id

    const collection_file = await db.collection("files");
    const item_list = await collection_file.deleteOne({filename: file_name})

    res.status(200).end(JSON.stringify({status: true, msg: 'OK'}))
})




// ------------------------------------
//            Clean Up
// ------------------------------------

const clean_up = async (user_name) => {
    try {
      conn = await client.connect();
    } catch(e) {
      console.error(e);
    }

    function isDateMoreThanFiveDaysAgo(inputDate) {
      const inputDateTime = new Date(inputDate).getTime();
      const currentDate = new Date().getTime();
      const timeDifference = currentDate - inputDateTime;
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    
      return daysDifference > 5;
    }

    let db = conn.db("grabaciones")
    const collection_file = await db.collection("files");
    const file_list = await collection_file.find({}).toArray()

    console.log(file_list)

    file_list.forEach(async file => {
      const file_date = file.date
      const is_more_than_5_days = isDateMoreThanFiveDaysAgo(file_date)

      if(isDateMoreThanFiveDaysAgo) {
        fetch('/api/delete/' + user_name + '/' + file.filename, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})})
      }
    })
}

router.get('/api/clean_up/:username', async (req, res) => {
    const one_hour = 1000 * 60  

    console.log('you are cleaning up')

    setInterval( async () => {
      const user_name = req.params.username
      await clean_up(user_name)
    }, one_hour)
})

module.exports = router;
