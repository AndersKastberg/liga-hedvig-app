const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sysadmin',
    password: 'c@n0n94554248',
    database: 'ligahedvig'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = connection;
