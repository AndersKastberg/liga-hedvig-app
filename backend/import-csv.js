const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql');

const ca = fs.readFileSync('cert/DigiCertGlobalRootCA.crt.pem');

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'ligahedvig.mysql.database.azure.com',
    user: 'sysadmin',
    password: '8tdB5.XJd!!geJs',
    database: 'ligahedvig',
    ssl: {
        ca: ca
    } 
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Function to delete all data from the table
const deleteAllData = (callback) => {
  const deleteSql = 'DELETE FROM prices_2025';
  connection.query(deleteSql, (err, result) => {
    if (err) throw err;
    console.log('All data deleted from the table');
    callback();
  });
};

// Function to import CSV data into MySQL
const importCsvData = (filePath) => {
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log('CSV file successfully processed');
      insertData(results);
    });
};

const insertData = (data) => {
  const sql = 'INSERT INTO prices_2025 (Name, Price, Url, Team) VALUES ?';
  const values = data.map(row => [ row.Name, row.Price, row.Url, row.Team]);
  connection.query(sql, [values], (err, result) => {
    if (err) throw err;
    console.log('Number of records inserted: ' + result.affectedRows);
    connection.end();
  });
};

// Run the delete function followed by the import function
deleteAllData(() => importCsvData('G:\\My Drive\\Cycling\\Manager2025\\Liga Hedvig 2025 - Prices.csv'));
