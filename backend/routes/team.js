const express = require('express');
const app=express();
const router = express.Router();
const connection = require('../db');

// Save or update a team with riders
router.post('/save', (req, res) => {
  const { userId, teamName, year, riders } = req.body;

  // Check if the team already exists
  const checkTeamQuery = 'SELECT id FROM teams WHERE user_id = ? AND name = ?';
  connection.query(checkTeamQuery, [userId, teamName], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }

    if (results.length > 0) {
      // Team exists, update riders
      const teamId = results[0].id;

      // Delete existing riders
      const deleteRidersQuery = 'DELETE FROM teamriders WHERE team_id = ?';
      connection.query(deleteRidersQuery, [teamId], (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error', error: error.message });
        }

        // Insert new riders
        const riderQueries = riders.map(rider => {
          return new Promise((resolve, reject) => {
            console.debug(`Inserting rider with ID: ${rider.id} into team ${teamId}`);
            const insertRiderQuery = 'INSERT INTO teamriders (team_id, rider_id) VALUES (?, ?)';
            connection.query(insertRiderQuery, [teamId, rider.id], (error) => { // Use "ID" here
              if (error) {
                console.error(error);
                return reject(error);
              }
              resolve();
            });
          });
        });

        Promise.all(riderQueries)
          .then(() => res.status(200).json({ message: 'Team updated successfully!' }))
          .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
          });
      });
    } else {
      // Team does not exist, create a new team
      const teamQuery = 'INSERT INTO teams (name, year, user_id) VALUES (?, ?, ?)';
      connection.query(teamQuery, [teamName, year, userId], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error', error: error.message });
        }

        const teamId = results.insertId;
        const riderQueries = riders.map(rider => {
          return new Promise((resolve, reject) => {
            const riderQuery = 'INSERT INTO teamriders (team_id, rider_id) VALUES (?, ?)';
            connection.query(riderQuery, [teamId, rider.ID], (error) => { // Use "ID" here
              if (error) {
                console.error(error);
                return reject(error);
              }
              resolve();
            });
          });
        });

        Promise.all(riderQueries)
          .then(() => res.status(201).json({ message: 'Team saved successfully!' }))
          .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
          });
      });
    }
  });
});


// Fetch teams for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  
  const teamQuery = `
    SELECT t.id AS teamId, t.name AS teamName, t.year, r.ID AS riderId, r.Name AS riderName, r.Price AS riderPrice
    FROM teams t
    LEFT OUTER JOIN teamriders tr ON t.id = tr.team_id
    LEFT OUTER JOIN prices_2025 r ON tr.rider_id = r.ID
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

router.get('/teams/:teamId', (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const teamQuery = `
    SELECT t.id AS teamId, t.name AS teamName, t.year, r.ID AS riderId, r.Name AS riderName, r.Price AS riderPrice
    FROM teams t
    LEFT OUTER JOIN teamriders tr ON t.id = tr.team_id
    LEFT OUTER JOIN prices_2025 r ON tr.rider_id = r.ID
    WHERE tr.team_id = ?
  `;
  
  connection.query(teamQuery, [teamId], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error fetching team', error });
    }   
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


module.exports = router;
