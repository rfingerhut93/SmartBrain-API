// Function to handle signin endpoint
// Checks that user email and password match in 
// database
const postSignIn = (database, bcrypt) => (req, res) => {
    const {email, password} = req.body;

    //Validate form inputs
    if(!email || !password){
        return res.status(400).json('Incorrect form submission');
    }
    
    database.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
        if (bcrypt.compareSync(password, data[0].hash)){
            return database.select('*')
            .from('users')
            .where('email', '=', email)
            .then( user => res.json(user[0]))
            .catch(err => res.status(400).json('Unable to get user'))
        } else {
            res.status(400).json('Wrong Credentials')
        }
    })
    .catch(err => res.status(400).json('Wrong credentials'))
}

export default postSignIn