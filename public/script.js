async function fetchMovies() {
  const res = await fetch('http://localhost:5000/movies');
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

    const reviewMoreBtn = movieCard.querySelector('.review-more-btn');
    if (reviewMoreBtn) {
      reviewMoreBtn.addEventListener('click', () => {
        movieCard.querySelector('.reviews').innerHTML = movie.reviews.map(r => `<p>${r.user}: ${r.review}</p>`).join('');
      });
    }

    const playBtn = movieCard.querySelector('.play-trailer-btn');
    playBtn.addEventListener('click', () => {
      // Get the video ID from the YouTube trailer URL
      const videoId = movie.trailer.split('v=')[1].split('&')[0];

      // Create the iframe element with the correct URL format for embedding
      const trailerIframe = document.createElement('iframe');
      trailerIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&fs=1`;
      trailerIframe.width = "800"; 
      trailerIframe.height = "450"; 
      trailerIframe.frameBorder = "0";
      trailerIframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      trailerIframe.allowFullscreen = true;

      // Append the iframe to the movie card (this will replace the button)
      movieCard.appendChild(trailerIframe);
      playBtn.style.display = 'none';

      // Create the close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'X';
      closeBtn.className = 'close-trailer-btn';
      closeBtn.addEventListener('click', () => {
        movieCard.removeChild(trailerIframe);
        movieCard.removeChild(closeBtn);
        playBtn.style.display = 'inline';
      });
      movieCard.appendChild(closeBtn);
    });
  });
}

window.onload = fetchMovies;
