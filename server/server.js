const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser
const bcrypt = require('bcrypt')
const cors = require("cors");
const pool = require("./database");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/users', async(req, res) => {
    try{
      
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        const user = {
            name: req.body.name, 
            password: hashedPassword
        };
        // Assuming you want to add users to an array
        // But you haven't defined 'users' array yet, so let's push to 'posts' array for now
        posts.push(user);
        res.status(201).send();
    }
    catch(err){
        console.log(err)
        res.status(500).send()
    }
    
});

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.get('users/login', async(req, res) => {
    const user = users.find(user => user.name = req.body.name)
    if (user == null) {
        return res.status(404).send('user not found')
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Success')
        }else{
            res.send('Not Allowed')
        }
    }catch(err){
        console.log(err);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
