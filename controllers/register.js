// Function to handle register endpoint
// Adds new user to database
const postRegister = (database, bcrypt, saltRounds) => (req, res) => {
    const {email, name, password} = req.body;

    //Validate form inputs
    if(!email || !name || !password){
        return res.status(400).json('Incorrect form submission');
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    // Creating a transaction to complete login and user table update
    database.transaction(trx => {
        // Insert email and hash into login table
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        // returns email from login table
        .returning('email')
        // uses returned email from login table to isnert into users table
        .then(loginEmail => {    
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,                    joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        // Must commit to add changes
        .then(trx.commit)
        // If fails, rollback (login and user table not updated)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))  
}

export default postRegister;