import express from "express";
import bcrypt from "bcrypt";
import cors from 'cors';
import knex from 'knex';
import getRoot from "./controllers/root.js";
import postRegister from './controllers/register.js'
import postSignIn from "./controllers/signin.js";
import getProfile from "./controllers/getProfile.js";

import { putEntries, handleAPICall } from "./controllers/entries.js";
const saltRounds = 10;

const app = express();
app.use(cors());
const port = process.env.PORT || 3000; 
app.use(express.json());

// DATABASE CONNECTION SETUP
const database = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'posttestREF',
      database : 'smartbrain'
    }
  });



// Root Endpoint
app.get('/', getRoot);

// Sign In Endpoint
app.post('/signin', postSignIn(database, bcrypt));

// Register Endpoint
app.post('/register', postRegister(database, bcrypt, saltRounds));

// Profile Endpoint
app.get('/profile/:id', getProfile(database));

// Image Endpoint
app.put('/entries', putEntries(database));

app.post('/imageurl', (req, res) => {
    handleAPICall(req, res);
})

app.listen(port, () => {
    console.log(`Listening on Port ${port}...`)
});