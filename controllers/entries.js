import dotenv from 'dotenv';

dotenv.config();

// Function to handle call to Clarifai API
export const handleAPICall = (req, res) => {

        const { imageUrl } = req.body;

        const PAT = process.env.PAT;
        const USER_ID = process.env.USER_ID;
        const APP_ID = process.env.APP_ID;
        const MODEL_ID = process.env.MODEL_ID;
        const MODEL_VERSION_ID = process.env.MODEL_VERSION_ID;

        const raw = JSON.stringify({
            "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
            },
            "inputs": [
            {
                "data": {
                "image": {
                    "url": imageUrl
                }
                }
            }
            ]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT,
            'Content-Type': 'application/json'
            },
            body: raw
        };
        
        fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions)
        .then((clarifaiResponse) => clarifaiResponse.json())
        .then((clarifaiResult) => {
            const clarifaiConcept = clarifaiResult.outputs[0].data.concepts[0].name;
            res.json({ clarifaiConcept });
        })
        .catch((error) => {
            console.error('Error in Clarifai API request:', error);
            res.status(500).json({ error: 'Internal Sssserver Error' });
        });
};

// Function to handle image entries endpoint
// Update entries count for requested user.
export const putEntries = (database) => (req, res) => {
    const { id } = req.body;
    database('users').where('id', '=', id).increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(404).json('Unable to get entries')
    )
}

