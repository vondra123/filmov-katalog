-- Vytvor tabulku "items"
CREATE TABLE IF NOT EXISTS items ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, 
  description TEXT
);