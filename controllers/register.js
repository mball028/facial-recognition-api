const handleRegister = (req, res, db, bcrypt) => {
    //we are recieiving these inputs from our post requests and destructuring them from the body.
    const { email, name, password } = req.body;
    if (!email || !name || !password){
        return res.status(400).json('incorrect form submission')
    }
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                //.inesrt allows us to insert into our pg db using knex
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register'))

}

module.exports = {
    handleRegister: handleRegister
}