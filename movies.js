const APILINK = '';
const IMG_PATH = "";
const SEARCHAPI = "";
const MOVIE_DETAILS_API = "";

const form = document.getElementById('form');
const query = document.getElementById('query');
const moviesGrid = document.getElementById('movies');
const feedback = document.getElementById('feedback');
const loadMoreBtn = document.getElementById('load-more');
const movieDetailsModal = document.createElement('div');
const homeButton = document.createElement('button');

let currentPage = 1;
let currentQuery = "";

// Set up home button
homeButton.textContent = "Home";
homeButton.className = "home-btn";
homeButton.style.display = "none";
document.body.prepend(homeButton);

homeButton.addEventListener("click", () => {
  currentQuery = "";
  currentPage = 1;
  moviesGrid.innerHTML = "";
  homeButton.style.display = "none";
  returnMovies(APILINK + currentPage);
});

returnMovies(APILINK + currentPage);

function returnMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length === 0) {
        showFeedback("No movies found. Try a different search.");
      } else {
        showMovies(data.results);
        loadMoreBtn.style.display = data.page < data.total_pages ? "block" : "none";
      }
    })
    .catch(() => showFeedback("Error fetching movies. Please try again later."));
}

function showMovies(movies) {
  feedback.style.display = "none";
  movies.forEach((movie) => {
    const card = document.createElement('div');
    card.className = "card";
    card.setAttribute('data-id', movie.id);

    const image = document.createElement('img');
    image.className = "thumbnail";
    image.src = movie.poster_path ? IMG_PATH + movie.poster_path : 'placeholder.jpg';

    const title = document.createElement('h3');
    title.textContent = movie.title;

    const details = document.createElement('p');
    details.textContent = `⭐ ${movie.vote_average} | 📅 ${movie.release_date || "N/A"}`;

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(details);
    moviesGrid.appendChild(card);

    // Add event listener to fetch movie details on click
    card.addEventListener('click', () => showMovieDetails(movie.id));
  });
}

function showFeedback(message) {
  feedback.style.display = "block";
  feedback.textContent = message;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchItem = query.value.trim();

  if (!searchItem) {
    showFeedback("Please enter a search term.");
    return;
  }

  currentQuery = searchItem;
  currentPage = 1;
  moviesGrid.innerHTML = "";
  homeButton.style.display = "block";
  returnMovies(SEARCHAPI + searchItem + "&page=" + currentPage);
});

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  const url = currentQuery ? SEARCHAPI + currentQuery + "&page=" + currentPage : APILINK + currentPage;
  returnMovies(url);
});

function showMovieDetails(movieId) {
  fetch(`${MOVIE_DETAILS_API}${movieId}?api_key=acf227e0f1ed60d3234242790a96fd0f`)
    .then((res) => res.json())
    .then((movie) => {
      displayMovieDetails(movie);
    })
    .catch(() => showFeedback("Error fetching movie details. Please try again later."));
}

function displayMovieDetails(movie) {
  movieDetailsModal.innerHTML = "";
  movieDetailsModal.className = "modal";
  movieDetailsModal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <div class="modal-body">
        <img src="${movie.poster_path ? IMG_PATH + movie.poster_path : 'placeholder.jpg'}" class="modal-image">
        <div class="modal-details">
          <h2>${movie.title}</h2>
          <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
          <p><strong>Rating:</strong> ⭐ ${movie.vote_average} (${movie.vote_count} votes)</p>
          <p><strong>Description:</strong> ${movie.overview || "No description available."}</p>
          <p><strong>Genres:</strong> ${movie.genres.map((genre) => genre.name).join(", ")}</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(movieDetailsModal);
  movieDetailsModal.style.display = "flex";
  movieDetailsModal.style.opacity = 1;

  const closeButton = movieDetailsModal.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    movieDetailsModal.style.opacity = 0;
    setTimeout(() => movieDetailsModal.style.display = "none", 500);
  });

  movieDetailsModal.addEventListener("click", (e) => {
    if (e.target === movieDetailsModal) {
      movieDetailsModal.style.opacity = 0;
      setTimeout(() => movieDetailsModal.style.display = "none", 500);
    }
  });
}

