

INSERT INTO genres (name) VALUES 
  ('Drama'), 
  ('Komedia'), 
  ('Akční'), 
  ('Sci-Fi'), 
  ('Horor');


INSERT INTO movies (title, year, genre_id) VALUES
  ('Forrest Gump', 1994, 1),
  ('The Hangover', 2009, 2),
  ('Mad Max: Fury Road', 2015, 3),
  ('Interstellar', 2014, 4),
  ('The Conjuring', 2013, 5),
  ('The Godfather', 1972, 1),
  ('Superbad', 2007, 2),
  ('John Wick', 2014, 3),
  ('Blade Runner 2049', 2017, 4),
  ('A Nightmare on Elm Street', 1984, 5);


INSERT INTO ratings (username, rating, movie_id) VALUES
  ('alice', 5, 1),
  ('bob', 4, 1),
  ('charlie', 3, 2),
  ('diana', 5, 4),
  ('eva', 4, 3),
  ('frank', 2, 6),
  ('gina', 5, 7),
  ('harry', 4, 8),
  ('ivan', 3, 9),
  ('julia', 5, 10);
