const mysql = require('mysql');
const fs = require('fs');
const ca = fs.readFileSync('cert/DigiCertGlobalRootCA.crt.pem');
const connection = mysql.createConnection({
  host: 'ligahedvig.mysql.database.azure.com',
  user: 'sysadmin',
  password: '8tdB5.XJd!!geJs',
  database: 'ligahedvig',
  ssl: {
      ca: ca
  } });

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = connection;
