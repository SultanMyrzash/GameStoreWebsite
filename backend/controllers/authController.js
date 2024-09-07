const db = require('../dbConfig');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({path: '../.env'});

const test = (req, res) => {
    res.send('test is working');
}

//login endpoint
const loginUser = (req, res) => {
    const { username, password } = req.body;

    if (!username) {//status(400) degen http status code
        return res.status(400).json({ error: 'Please write a username' });
    }
    if (!password) {    
        return res.status(400).json({ error: 'Please write a password' });
    }

    try {
        // Check if the user exists
        db.query('SELECT * FROM Users WHERE username = ?', [username], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(400).json({ error: 'User does not exist' });
            }

            const user = results[0];
            // Check if the password is correct
            if (user.password !== password) {
                return res.status(400).json({ error: 'Wrong password' });
            }

            // generate a JWT token
            const token = jwt.sign({ id: user.id, username: user.username, is_gamepublisher: user.is_gamepublisher }, process.env.JWT_SECRET, { expiresIn: '1 hour' });

            return res.status(200).json({ message: 'User logged in successfully', token });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server error' });
    }
}


//register endpoint
const registerUser = async (req, res) => {
    const { username, password, password2 } = req.body;

    if (!username) {
        return res.json({ error: 'Please add a username' });
    }
    if (!password) {
        return res.json({ error: 'Please add a password' });
    }
    if (!password2 || password !== password2) {
        return res.json({ error: 'Passwords do not match' });
    }

    try {
        // Check if the user already exists
        db.query('SELECT * FROM Users WHERE username = ?', [username], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length > 0) {
                return res.json({ error: 'User already exists' });
            }

            // If user does not exist, proceed to insert the new user
            db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                return res.json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

const getProfile = async (req, res) => {
   const {token} = req.body;
   console.log(token);
   if (token) {
       jwt.verify(token, process.env.JWT_SECRET, (err, user) => {//
           if (err) {
               res.json(null);
           };
           res.json(user);
       })
   } else {
       res.json(null);
   }
}

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
}