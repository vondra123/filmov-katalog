document.addEventListener('DOMContentLoaded', () => {
  const movieForm = document.getElementById('movieForm');
  const ratingForm = document.getElementById('ratingForm');
  const movieList = document.getElementById('movieList');
  const genreSelect = document.getElementById('genreSelect');
  const movieRatingSelect = document.getElementById('movieRatingSelect');

  let genreMap = {}; 
  function fetchGenres() {
    fetch('/api/genres')
      .then(res => res.json())
      .then(data => {
        genreSelect.innerHTML = '';
        genreMap = {};
        data.forEach(genre => {
          const opt = document.createElement('option');
          opt.value = genre.id;
          opt.textContent = genre.name;
          genreSelect.appendChild(opt);
          genreMap[genre.id] = genre.name;
        });
        fetchMovies();
      });
  }

  function fetchMovies() {
    fetch('/api/movies')
      .then(res => res.json())
      .then(data => {
        movieList.innerHTML = '';
        movieRatingSelect.innerHTML = '<option value="">Vyber film</option>';
        data.forEach(movie => {
          const genreName = movie.genre || 'neznámý';
          const average = movie.average_rating ? Number(movie.average_rating).toFixed(1) : 'N/A';
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>${movie.title}</strong> (${movie.year})<br>
            Žánr: ${genreName}<br>
            Průměrné hodnocení: ${average}<br>
            <button data-id="${movie.id}" class="delete-btn">Smazat</button>
          `;
          movieList.appendChild(li);

          const option = document.createElement('option');
          option.value = movie.id;
          option.textContent = movie.title;
          movieRatingSelect.appendChild(option);
        });
      });
  }

  movieForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const genre_id = genreSelect.value;

    fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, year, genre_id })
    })
    .then(() => {
      movieForm.reset();
      fetchMovies();
    });
  });

  movieList.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      fetch(`/api/movies/${id}`, { method: 'DELETE' })
        .then(() => fetchMovies());
    }
  });

  ratingForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const rating = document.getElementById('rating').value;
    const movie_id = movieRatingSelect.value;

    fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, rating, movie_id })
    }).then(() => {
      ratingForm.reset();
      fetchMovies(); 
    });
  });

  fetchGenres();
});
