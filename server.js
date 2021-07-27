const express = require('express');
const bcrypt =  require('bcrypt');
const { findOneUser, validate } = require('./utilities');
// rouds=10: ~10 hashes/sec
const saltRounds = 10; 

// Mock database users
const users = [];

const app = express();

app.use(express.json());

app.get('/user', (req, res) => {
    res.json(users).send();
});

app.post('/user', async (req, res) => {
    const { name, password } = validate(req.body);

    const user = findOneUser(users, name);
    if (user !== undefined) {
        return res.status(200).send('User signed in');
    }

    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = {
            name: name,
            passwordHash: passwordHash,
        };
        users.push(newUser);
        res.json(newUser);
        res.status(201).send();
    } catch (error) {
        res.status(500).send();
    }

    // bcrypt.hash(password, saltRounds, function(err, hash) {
    //     // Store hash in your password DB
    //     const newUser = {
    //         name: name,
    //         passwordHash: hash,
    //     }
    //     users.push(newUser);
    // });

    // res.json({
    //     name: name,
    //     password: password,
    // });
    // res.status(201).send();
});

app.post('/user/login', async (req, res) => {
    const { name, password } = validate(req.body);

    const user = findOneUser(users, name);
    if (user === undefined) {
        return res.send('Cannot find user');
    }

    try {
        const match = await bcrypt.compare(password, user.passwordHash);
        if (match) {
            return res.status(200).send('Success Log In');
        } else {
            return res.status(401).send('Not Allowed');
        }
    } catch (error) {
        return res.status(500).send();
    }

    // bcrypt.compare(password, user.passwordHash).then(result => {
    //     if (result === true) {
    //         return res.send('Success Log In');
    //     } else {
    //         res.send('Not Allowed');
    //     }
    // }).catch(err => {
    //     res.status(500).send();
    // });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`[server:] Server is runnung on PORT ${PORT}`));


