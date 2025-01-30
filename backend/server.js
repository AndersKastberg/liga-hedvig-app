const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const teamRoutes = require('./routes/team');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api/team', teamRoutes);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'sysadmin',
    password: 'c@n0n94554248',
    database: 'ligahedvig'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.get('/data', (req, res) => {
    let sql = 'SELECT * FROM prices_2025';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An internal server error occurred.', error: err.message });
  });

app.listen(3000, () => {
    console.log('Server started on port 3000');
});