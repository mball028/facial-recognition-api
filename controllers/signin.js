const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json('incorrect form submission');
    }
    // if email and password from the frontend match the login db, load user via email from users db
    db.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
  }
  
  module.exports = {
    handleSignin: handleSignin
  }