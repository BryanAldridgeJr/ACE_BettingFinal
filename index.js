require('dotenv').config()
const express = require('express');
const mysql = require('mysql');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Your React app's URL
    credentials: true,
}));

const db = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});


app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?, ?, ?)";
    const values = [req.body.name, req.body.email, req.body.password];
    db.query(sql, values, (err, data) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        return res.status(201).json(data);
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        if (data.length > 0) {
            return res.status(200).json({
                data,
                msg: "Success"
            });
        } else {
            return res.status(401).json("Failed");
        }
        
    });
});



app.post('/placed', (req, res) => {

    const sql = "INSERT INTO bets ( `user_id`, `name`, `price`, `time`) VALUES (?, ?, ?, ?)";
    const values = [req.body.id, req.body.name, req.body.price, req.body.time];
    db.query(sql, values, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error: err.message});
        }
        return res.status(201).json(data);
    });
});

app.get('/bets/:user_id', (req, res) => {
    const userId = req.params.user_id; // Use req.params to access route parameters
    const sql = "SELECT `name`, `price`, `time` FROM bets WHERE `user_id` = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length > 0) {
            return res.status(200).json({
                data,
                msg: "Success"
            });
        } else {
            return res.status(404).json({ msg: "No bets found for the user" });
        }
    });
});

app.delete('/delete-bet/:bet_id', (req, res) => {
    const betId = req.params.bet_id;
    const sql = "DELETE FROM bets WHERE id = ?";
    db.query(sql, [betId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.affectedRows > 0) {
            return res.status(200).json({ msg: "Bet deleted successfully" });
        } else {
            return res.status(404).json({ msg: "Bet not found" });
        }
    });
});

app.get('/user-info/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const sql = "SELECT `name`, `email` FROM `login` WHERE `user_id` = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length > 0) {
            return res.status(200).json({
                data: data[0], // Assuming there's only one user with this ID
                msg: "Success"
            });
        } else {
            return res.status(404).json({ msg: "User not found" });
        }
    });
});

/*
app.get('/login/:user_id', (req, res) => {
    const userId = req.params.user_id; // Use req.params to access route parameters
    const sql = "SELECT `name`, `email` FROM login WHERE `user_id` = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length > 0) {
            return res.status(200).json({
                data,
                msg: "Success"
            });
        } else {
            return res.status(404).json({ msg: "No bets found for the user" });
        }
    });
});
*/
/*
app.get('/bets/:user_id', (req, res) => {
    const sql = "SELECT `name`, `price`, `time` FROM bets WHERE `user_id` = ?";
    db.query(sql, [req.body.id], (err, data) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        if (data.length > 0) {
            return res.status(200).json({
                data,
                msg: "Success"
            });
        } else {
            return res.status(401).json("Failed");
        }
        
    });
});
*/
/*
app.post('/bets', (req, res) => {
    const sql = "SELECT * FROM bets WHERE `user_id` = ?"
    db.query(sql, [req.body.team, req.body.price], (err, data) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        if (data.length > 0) {
            return res.status(200).json("Success");
        } else {
            return res.status(401).json("Failed");
        }
    });
});
*/
app.get('/profile', (req, res) => {
    res.status(200).json({info: 'Random'});
});
/*
app.get('/profile/email', (req, res) => {
    const sql = "SELECT `email` FROM table WHERE"
    res.status(200).json({info: 'Random'});
});
*/

app.listen(8081, () => {
    console.log("Listening on port 8081");
});
