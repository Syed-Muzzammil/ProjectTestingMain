async function fetchMovies(query = '') {
  const res = await fetch(`http://localhost:5000/movies?search=${query}`);
  const movies = await res.json();
  const moviesContainer = document.getElementById('movies-container');
  moviesContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.innerHTML = `
      <img src="${movie.poster}" class="movie-poster" alt="${movie.title}" />
      <h2>${movie.title}</h2>
      <div class="description">${movie.description.slice(0, 100)}<span class="more-btn">...more</span></div>
      <div class="rating">Rating: ${movie.rating}/5</div>
      <button class="play-trailer-btn">Play Trailer</button>
      <button class="less-btn" style="display:none;">Less</button>
      <div class="reviews">
        ${movie.reviews.slice(0, 3).map(r => `<p>${r.user}: ${r.review}</p>`).join('')}
        ${movie.reviews.length > 3 ? '<span class="review-more-btn">...more reviews</span>' : ''}
      </div>
    `;
    moviesContainer.appendChild(movieCard);

    const moreBtn = movieCard.querySelector('.more-btn');
    moreBtn.addEventListener('click', () => {
      movieCard.querySelector('.description').innerHTML = movie.description;
      movieCard.querySelector('.more-btn').style.display = 'none';
      movieCard.querySelector('.less-btn').style.display = 'inline';
    });

    const lessBtn = movieCard.querySelector('.less-btn');
    lessBtn.addEventListener('click', () => {
      movieCard.querySelector('.description').innerHTML = movie.description.slice(0, 100) + '<span class="more-btn">...more</span>';
      movieCard.querySelector('.more-btn').style.display = 'inline';
      movieCard.querySelector('.less-btn').style.display = 'none';
    });

    const playBtn = movieCard.querySelector('.play-trailer-btn');
    playBtn.addEventListener('click', () => {
      const videoId = movie.trailer.split('v=')[1].split('&')[0];
      const trailerIframe = document.createElement('iframe');
      trailerIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&fs=1`;
      trailerIframe.width = "800";
      trailerIframe.height = "450";
      trailerIframe.frameBorder = "0";
      trailerIframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      trailerIframe.allowFullscreen = true;
      movieCard.appendChild(trailerIframe);

      playBtn.style.display = 'none';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'X';
      closeBtn.addEventListener('click', () => {
        movieCard.removeChild(trailerIframe);
        movieCard.removeChild(closeBtn);
        playBtn.style.display = 'inline';
      });
      movieCard.appendChild(closeBtn);
    });
  });
}

async function searchMovies() {
  const query = document.getElementById('search-input').value;
  fetchMovies(query);
}

window.onload = () => fetchMovies();