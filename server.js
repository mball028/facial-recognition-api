const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,//this is the address for home
    ssl: true
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

// DEPENDENCY INJECTION ---------------------------------------------

app.get('/', (req, res)=> { res.send('server is working') })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})
app.delete('/deleteuser', (req, res) => {
  const { id } = req.body;
  // if(!id){
  //   return res.status(400).json('no user with such id');
  // }
    db.select('*').from('login').where('id', id).del()
   return  res.status(200).json('user deleted');
})

app.listen(process.env.PORT || 3500, ()=> {
  console.log(`The server is running on ${process.env.PORT}`);
})




// app.get('/', (req, res) => {
//   console.log(db.login)
//   res.send(db.users)
// })


// app.post('/signin', (req, res) => {
//   const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json('incorrect form submission');
//     }
//     db.select('email', 'hash').from('login')
//       .where('email', '=', email)
//       .then(data => {
//         const isValid = bcrypt.compareSync(password, data[0].hash);
//         if (isValid) {
//           return db.select('*').from('users')
//             .where('email', '=', email)
//             .then(user => {
//               res.json(user[0])
//             })
//             .catch(err => res.status(400).json('unable to get user'))
//         } else {
//           res.status(400).json('wrong credentials')
//         }
//       })
//       .catch(err => res.status(400).json('wrong credentials'))
// })


// app.post('/register', (req, res) => {
//   const { email, name, password } = req.body;
//     if (!email || !name || !password){
//         return res.status(400).json('incorrect form submission')
//     }
//     const hash = bcrypt.hashSync(password);

//     db.transaction(trx => {
//         trx.insert({
//             hash: hash,
//             email: email
//         })
//             .into('login')
//             .returning('email')
//             .then(loginEmail => {
//                 //.inesrt allows us to insert into our pg db using knex
//                 return trx('users')
//                     .returning('*')
//                     .insert({
//                         email: loginEmail[0],
//                         name: name,
//                         joined: new Date()
//                     })
//                     .then(user => {
//                         res.json(user[0]);
//                     })
//             })
//             .then(trx.commit)
//             .catch(trx.rollback)
//     })
//         .catch(err => res.status(400).json('unable to register'))

// })


// app.get('/profile/:id', (req, res) => {
//   const { id } = req.params;
//     db.select('*').from('users').where({id})
//       .then(user => {
//         if (user.length) {
//           res.json(user[0])
//         } else {
//           res.status(400).json('Not found')
//         }
//       })
//       .catch(err => res.status(400).json('error getting user'))
// })



// app.put('/image', (req, res) => {
//   const { id } = req.body;
//   db('users').where('id', '=', id)
//   .increment('entries', 1)
//   .returning('entries')
//   .then(entries => {
//     res.json(entries[0]);
//   })
//   .catch(err => res.status(400).json('unable to get entries'))
// })


/*
/ --> res = this is working 
/signin --> POST = sucess/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/