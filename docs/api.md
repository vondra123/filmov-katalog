API Endpointy

/api/movies

GET — získá všechny filmy

POST — přidá nový film (body: title, year, genre_id)

/api/movies/:id

GET — detail filmu

PUT — úprava filmu

DELETE — smaže film

/api/ratings

GET — získá všechna hodnocení

POST — přidá nové hodnocení (body: username, rating, movie_id)

/api/ratings/:id

GET, PUT, DELETE

/api/genres

GET — seznam žánrů (neměnitelné)