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

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).send('Invalid Token');
    }
};


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
        await pool.query('INSERT INTO posts (auth_name) VALUES ($1)',[req.body.name])
        
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

        // Compare passwords
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Generate JWT token with user information
            const token = jwt.sign({ user: { username: user.username } }, JWT_SECRET);
            res.json({ token });
        } else {
            res.status(401).send('Invalid password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

// Get all blogs except those created by the logged-in user
// Get all blogs except those created by the logged-in user
app.get('/blogs', verifyToken, async (req, res) => {
    try {
        // Get the username from the request body
        const username = req.body.username;

        // Get all blogs except those created by the logged-in user
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get blogs created by the logged-in user
app.post('/my-blogs', verifyToken, async (req, res) => {
    try {
        // Get the username from the request body
        const username = req.body.username;

        // Get blogs created by the logged-in user
        const result = await pool.query('SELECT * FROM posts WHERE auth_name = $1', [username]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create a new blog
app.post('/blogs',verifyToken, async (req, res) => {
    const { title, content, username } = req.body;
    try {
        // Create a new blog for the logged-in user
        await pool.query('INSERT INTO posts (title, content, auth_name) VALUES ($1, $2, $3)', [title, content, username]);
        res.status(201).send('Blog created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete a blog
app.delete('/blogs',verifyToken, async (req, res) => {
    const blogId = req.params.id;
    try {
        // Delete the specified blog belonging to the logged-in user
        await pool.query('DELETE FROM posts WHERE auth_name = $1', [req.body.username]);
        res.send('Blog deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update a blog
app.put('/blogs/:id', async (req, res) => {
    const blogId = req.params.id;
    const { title, content, username } = req.body;
    try {
        // Update the specified blog belonging to the logged-in user
        await pool.query('UPDATE blogs SET title = $1, content = $2 WHEREauth_name = $3', [title, content,username]);
        res.send('Blog updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
