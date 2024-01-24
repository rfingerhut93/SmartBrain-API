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
import dotenv from 'dotenv';

const app = express();
app.use(cors());
const port = process.env.PORT || 3000; 
app.use(express.json());

// DATABASE CONNECTION SETUP
const database = knex({
    client: 'pg',
    connection: {
      host : process.env.DATABASE_HOST,
      port : 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
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