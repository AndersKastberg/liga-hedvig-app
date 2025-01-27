const express = require('express');
const router = express.Router();
const connection = require('../db');

// Save a new team
router.post('/save', (req, res) => {
  const { userId, teamName, year, riders } = req.body;

  connection.query('SELECT COUNT(*) AS teamCount FROM teams WHERE user_id = ?', [userId], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    if (results[0].teamCount >= 5) return res.status(400).json({ message: 'Maximum 5 teams allowed per user.' });

    const teamQuery = 'INSERT INTO teams (name, year, user_id) VALUES (?, ?, ?)';
    connection.query(teamQuery, [teamName, year, userId], (error, results) => {
      if (error) return res.status(500).json({ error: error.message });

      const teamId = results.insertId;
      const riderQueries = riders.map(rider => {
        return new Promise((resolve, reject) => {
          const riderQuery = 'INSERT INTO teamriders (name, price, team_id) VALUES (?, ?, ?)';
          connection.query(riderQuery, [rider.name, rider.price, teamId], (error) => {
            if (error) reject(error);
            resolve();
          });
        });
      });

      Promise.all(riderQueries)
        .then(() => res.status(201).json({ message: 'Team saved successfully!' }))
        .catch(error => res.status(500).json({ error: error.message }));
    });
  });
});

// Fetch teams for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  
  const teamQuery = `
    SELECT t.id AS teamId, t.name AS teamName, t.year, r.id AS riderId, r.name AS riderName, r.price AS riderPrice
    FROM teams t
    LEFT JOIN teamriders r ON t.id = r.team_id
    WHERE t.user_id = ?
  `;
  
  connection.query(teamQuery, [userId], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });

    const teams = results.reduce((acc, row) => {
      const team = acc.find(t => t.id === row.teamId);
      const rider = { id: row.riderId, name: row.riderName, price: row.riderPrice };
      
      if (team) {
        team.riders.push(rider);
      } else {
        acc.push({ id: row.teamId, name: row.teamName, year: row.year, riders: [rider] });
      }
      
      return acc;
    }, []);

    res.status(200).json(teams);
  });
});

// Edit a team
router.put('/:teamId', (req, res) => {
  const { teamId } = req.params;
  const { teamName, year, riders } = req.body;
  
  const updateTeamQuery = 'UPDATE teams SET name = ?, year = ? WHERE id = ?';
  
  connection.query(updateTeamQuery, [teamName, year, teamId], (error) => {
    if (error) return res.status(500).json({ error: error.message });

    const deleteRidersQuery = 'DELETE FROM teamriders WHERE team_id = ?';
    
    connection.query(deleteRidersQuery, [teamId], (error) => {
      if (error) return res.status(500).json({ error: error.message });

      const riderQueries = riders.map(rider => {
        return new Promise((resolve, reject) => {
          const insertRiderQuery = 'INSERT INTO teamriders (name, price, team_id) VALUES (?, ?, ?)';
          connection.query(insertRiderQuery, [rider.name, rider.price, teamId], (error) => {
            if (error) reject(error);
            resolve();
          });
        });
      });

      Promise.all(riderQueries)
        .then(() => res.status(200).json({ message: 'Team updated successfully!' }))
        .catch(error => res.status(500).json({ error: error.message }));
    });
  });
});

module.exports = router;
