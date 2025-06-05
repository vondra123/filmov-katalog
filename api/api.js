const express = require('express');
const db = require('../database/db');

const router = express.Router();

// GET všechny filmy s průměrným hodnocením a názvem žánru
router.get('/movies', (req, res) => {
  const query = `
    SELECT m.id, m.title, m.year, g.name AS genre,
           ROUND(AVG(r.rating), 1) AS average_rating
    FROM movies m
    LEFT JOIN genres g ON m.genre_id = g.id
    LEFT JOIN ratings r ON r.movie_id = m.id
    GROUP BY m.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Chyba při získávání filmů:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET film podle ID
router.get('/movies/:id', (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT m.id, m.title, m.year, g.name AS genre,
           ROUND(AVG(r.rating), 1) AS average_rating
    FROM movies m
    LEFT JOIN genres g ON m.genre_id = g.id
    LEFT JOIN ratings r ON r.movie_id = m.id
    WHERE m.id = ?
    GROUP BY m.id
  `;
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Chyba při získávání filmu podle ID:', err);
      return res.status(500).json({ error: err.message });
    }
    if (!row) return res.status(404).json({ error: 'Movie not found' });
    res.json(row);
  });
});

// POST nový film
router.post('/movies', (req, res) => {
  const { title, year, genre_id } = req.body;
  if (!title || !year || !genre_id) {
    return res.status(400).json({ error: 'Title, year and genre_id are required' });
  }

  db.run('INSERT INTO movies (title, year, genre_id) VALUES (?, ?, ?)', [title, year, genre_id], function(err) {
    if (err) {
      console.error('Chyba při vkládání filmu:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Movie created' });
  });
});

// PUT aktualizace filmu
router.put('/movies/:id', (req, res) => {
  const id = req.params.id;
  const { title, year, genre_id } = req.body;
  if (!title || !year || !genre_id) {
    return res.status(400).json({ error: 'Title, year and genre_id are required' });
  }

  db.run('UPDATE movies SET title = ?, year = ?, genre_id = ? WHERE id = ?', [title, year, genre_id, id], function(err) {
    if (err) {
      console.error('Chyba při aktualizaci filmu:', err);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'Movie not found' });
    res.json({ message: 'Movie updated' });
  });
});

// DELETE film (pozor na FK omezení)
router.delete('/movies/:id', (req, res) => {
  const id = req.params.id;

  // Nejprve smažeme hodnocení k filmu
  db.run('DELETE FROM ratings WHERE movie_id = ?', [id], function(err) {
    if (err) {
      console.error('Chyba při mazání hodnocení k filmu:', err);
      return res.status(500).json({ error: err.message });
    }

    // Pak smažeme samotný film
    db.run('DELETE FROM movies WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Chyba při mazání filmu:', err);
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Movie not found' });
      res.json({ message: 'Movie and related ratings deleted' });
    });
  });
});

// GET všechna hodnocení
router.get('/ratings', (req, res) => {
  db.all('SELECT * FROM ratings', [], (err, rows) => {
    if (err) {
      console.error('Chyba při získávání hodnocení:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET hodnocení podle ID
router.get('/ratings/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM ratings WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Chyba při získávání hodnocení podle ID:', err);
      return res.status(500).json({ error: err.message });
    }
    if (!row) return res.status(404).json({ error: 'Rating not found' });
    res.json(row);
  });
});

// POST nové hodnocení
router.post('/ratings', (req, res) => {
  const { username, rating, movie_id } = req.body;
  if (!username || rating === undefined || !movie_id) {
    return res.status(400).json({ error: 'username, rating and movie_id are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' });
  }

  db.run(
    'INSERT INTO ratings (username, rating, movie_id) VALUES (?, ?, ?)',
    [username, rating, movie_id],
    function(err) {
      if (err) {
        console.error('Chyba při vkládání hodnocení:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Rating created' });
    }
  );
});

// PUT aktualizace hodnocení
router.put('/ratings/:id', (req, res) => {
  const id = req.params.id;
  const { username, rating, movie_id } = req.body;
  if (!username || rating === undefined || !movie_id) {
    return res.status(400).json({ error: 'username, rating and movie_id are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' });
  }

  db.run(
    'UPDATE ratings SET username = ?, rating = ?, movie_id = ? WHERE id = ?',
    [username, rating, movie_id, id],
    function(err) {
      if (err) {
        console.error('Chyba při aktualizaci hodnocení:', err);
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Rating not found' });
      res.json({ message: 'Rating updated' });
    }
  );
});

// DELETE hodnocení
router.delete('/ratings/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM ratings WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Chyba při mazání hodnocení:', err);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'Rating not found' });
    res.json({ message: 'Rating deleted' });
  });
});

// GET žánry
router.get('/genres', (req, res) => {
  db.all('SELECT * FROM genres', [], (err, rows) => {
    if (err) {
      console.error('Chyba při získávání žánrů:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
