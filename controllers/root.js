// Function to handle root endpoint
const getRoot = (req, res) => {
    res.send(db.users);
}

export default getRoot;