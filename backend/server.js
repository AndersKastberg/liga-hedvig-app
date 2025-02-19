const fs = require('fs');
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { expressjwt: expressJwt } = require('express-jwt');
const teamRouter = require('./routes/team');
const ca = fs.readFileSync('cert/DigiCertGlobalRootCA.crt.pem');
const path = require('path');

const db = mysql.createConnection({
  host: 'ligahedvig.mysql.database.azure.com',
  user: 'sysadmin',
  password: '8tdB5.XJd!!geJs',
  database: 'ligahedvig',
  ssl: {
      ca: ca
  } });



app.use(bodyParser.json());
app.use(cors());


// Serve Static Files from the Public Folder
app.use(express.static(path.join(__dirname, 'public/liga-hedvig-app/browser')));

app.use('/api/team', teamRouter);

const secretKey ='**a8s7d3f9j4k2h5g6q1w0e4r5t7y6u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q2w1e4r5t6y7u8i9o0p3q'



// Middleware to protect routes
app.use(expressJwt({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: ['/login', '/register'] }));


// Middleware to handle unauthorized errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ message: 'Unauthorized access - No token provided.' });
    } else {
      next(err);
    }
  });

// Register endpoint
app.post('/register', async (req, res) => {
    const { name, username, password } = req.body;  // Include name
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, username, password) VALUES (?, ?, ?)', [name, username, hashedPassword], (error, results) => { // Include name in query
      if (error) {
        res.status(500).json({ message: 'Error registering user', error });
      } else {
        res.status(201).json({ message: 'User registered successfully' });
      }
    });
  });
    
  // Login endpoint
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error logging in', error });
      } else if (results.length === 0) {
        res.status(401).json({ message: 'Invalid username or password' });
      } else {
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      }
    });
  });
  
// Change password endpoint
app.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.body.userId; // Assuming user ID is stored in request object
  
    // Fetch the user from the database
    db.query('SELECT password FROM users WHERE id = ?', [userId], async (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error fetching user data', error });
      }
  
      const user = results[0];
      const match = await bcrypt.compare(currentPassword, user.password);
  
      if (!match) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error updating password', error });
        }
        res.status(200).json({ message: 'Password changed successfully' });
      });
    });
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

// Handle All Other Routes and Serve the Angular App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/liga-hedvig-app/browser/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An internal server error occurred.', error: err.message });
  });

app.listen(3000, () => {
    console.log('Server started on port 3000');
});