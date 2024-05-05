require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken package
const cors = require('cors');
const pool = require('./database');

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// JWT secret key (store it securely)
const JWT_SECRET = process.env.JWT_SECRET;

// Routes
app.post('/users', async (req, res) => {
    try {
        // Check password length
        if (req.body.password.length > 12) {
            return res.status(400).send('Password length exceeds the limit');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Store user credentials in the database
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [req.body.name, hashedPassword]);
        
        res.status(201).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

app.post('/users/login', async (req, res) => {
    try {
        // Find user by username
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [req.body.name]);
        const user = result.rows[0];
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        const sus = await bcrypt.compare(req.body.password, user.password);

        // Compare passwords
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Generate JWT token
            const token = jwt.sign({ username: user.username }, JWT_SECRET);
            res.json({ token });
        } else {
            res.status(401).send('Invalid password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
