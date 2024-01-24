// Function to handle profile endpoint
// Finds user in database and responds with user
// object.
// For future installation.
const getProfile = (database) => (req, res) => {
    const {id} = req.params;
    database.select('*').from('users').where('id', id)
    .then(user => {
        if (user.length){
            res.json(user[0])
        } else {
            res.status(404).json('Error getting user')
        }
    })
}

export default getProfile;