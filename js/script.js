const root = document.querySelector(":root");
const body = document.querySelector("body");
const headerContainer = document.querySelector(".header__container-logo");
const movies = document.querySelector(".movies");
const input = document.querySelector(".input");
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal__body");
const themeBtn = document.querySelector(".btn-theme");

const imgLogo = document.createElement("img");
const h1Logo = document.createElement("h1");
const btnClose = document.createElement("img");

modalBody.append(btnClose);
headerContainer.append(imgLogo, h1Logo);
h1Logo.classList.add("header__title");
h1Logo.textContent = "CUBOS FLIX";
imgLogo.alt = "Logo";

btnClose.classList.add("modal__close");
btnClose.src = "";
btnClose.alt = "Close";

currentTheme();
search();

function movieCards(data) {
  const arrayFilms = data.data.results;

  arrayFilms.forEach((element) => {
    const Movie = document.createElement("div");
    const MovieInfo = document.createElement("div");
    const MovieTitle = document.createElement("span");
    const MovieRating = document.createElement("span");
    const rating = document.createElement("img");

    Movie.classList.add("movie");
    MovieInfo.classList.add("movie__info");
    MovieTitle.classList.add("movie__title");
    MovieRating.classList.add("movie__rating");

    Movie.append(MovieInfo);
    MovieInfo.append(MovieTitle, MovieRating);
    MovieRating.append(rating);
    movies.append(Movie);

    Movie.id = element.id;

    MovieTitle.textContent = element.title;
    MovieRating.textContent = element.vote_average.toFixed(1);

    if (!element.poster_path) {
      Movie.style.backgroundImage = `url(./assets/noposter.jpg)`;
    } else {
      Movie.style.backgroundImage = `url(${element.poster_path})`;
    }
    rating.src = "./assets/estrela.svg";
    rating.alt = "Star";

    Movie.addEventListener("click", (event) => {
      displayModal(event.target);
      modal.classList.remove("hidden");
    });
  });
}

function highlight() {
  const random = Math.floor(Math.random() * 4);

  const videoHighlight = document.querySelector(".highlight__video");
  const titleHighlight = document.querySelector(".highlight__title");
  const ratingHighlight = document.querySelector(".highlight__rating");
  const genresHighlight = document.querySelector(".highlight__genres");
  const dateHighlight = document.querySelector(".highlight__launch");
  const descriptionHighlight = document.querySelector(
    ".highlight__description"
  );
  const linkVideoHighlight = document.querySelector(".highlight__video-link");

  const play = document.querySelector(".play");

  async function site() {
    try {
      const film = await films.get(
        "discover/movie?language=pt-BR&include_adult=false"
      );
      const highlightMovie = await films.get(
        `movie/${film.data.results[random].id}?language=pt-BR`
      );
      const video = await films.get(
        `movie/${film.data.results[random].id}/videos?language=pt-BR`
      );
      videoHighlight.style.backgroundImage = `url(${film.data.results[random].backdrop_path})`;
      videoHighlight.style.backgroundSize = "cover";

      videoHighlight.classList.add("highlight_background_video");

      titleHighlight.textContent = film.data.results[random].title;

      ratingHighlight.textContent =
        film.data.results[random].vote_average.toFixed(1);

      descriptionHighlight.textContent = film.data.results[random].overview;

      dateHighlight.textContent = new Date(
        film.data.results[random].release_date
      ).toDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timezone: "UTC",
      });

      genresHighlight.textContent = highlightMovie.data.genres
        .map((genre) => genre.name)
        .join(", ");

      if (video.data.results.length === 0) {
        videoHighlight.removeChild(play);
      } else {
        linkVideoHighlight.href = `https://www.youtube.com/watch?v=${video.data.results[0].key}`;
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  site();
}

async function getMovies() {
  try {
    const film = await films.get(
      "discover/movie?language=pt-BR&include_adult=false"
    );
    movieCards(film);
  } catch (error) {
    console.log(error.message);
  }
  page();
}

function currentTheme() {
  if (localStorage.theme === "light" || !localStorage.theme) {
    lighMode();
  } else {
    darkMode();
  }
}

function changeTheme() {
  if (localStorage.theme === "dark") {
    lighMode();
    localStorage.setItem("theme", "light");
  } else {
    darkMode();
    localStorage.setItem("theme", "dark");
  }
}

function darkMode() {
  imgLogo.src = "./assets/logo.svg";
  themeBtn.src = "./assets/dark-mode.svg";
  root.style.setProperty("--background", "#000000");
  root.style.setProperty("--input-color", "#3e434d");
  root.style.setProperty("--text-color", "#ffffff");
  root.style.setProperty("--bg-secondary", "#2d3440");
  btnClose.src = "./assets/close.svg";
}

function lighMode() {
  imgLogo.src = "./assets/logo-dark.png";
  themeBtn.src = "./assets/light-mode.svg";
  root.style.setProperty("--background", "#ffff");
  root.style.setProperty("--input-color", "#979797");
  root.style.setProperty("--text-color", "#1b2028");
  root.style.setProperty("--bg-secondary", "#ededed");
  btnClose.src = "./assets/close-dark.svg";
}

async function displayModal(movie) {
  const modalTitle = document.createElement("h3");
  const modalPlay = document.createElement("img");
  const modalImg = document.createElement("img");
  const divImg = document.createElement("div");
  const modalDescription = document.createElement("p");
  const modalGenreAverage = document.createElement("div");
  const modalGenre = document.createElement("div");
  const modalAverage = document.createElement("div");
  const aLink = document.createElement("a");

  modalGenreAverage.append(modalGenre, modalAverage);
  divImg.classList.add("img__modal");
  btnClose.classList.add("modal__close");
  modalTitle.classList.add("modal__title");
  modalImg.classList.add("modal__img");
  modalDescription.classList.add("modal__description");
  modalGenreAverage.classList.add("modal__genre-avarage");
  modalGenre.classList.add("modal__genre");
  modalAverage.classList.add("modal__average");
  modalPlay.classList.add("play");

  modalPlay.src = "./assets/play.svg";

  btnClose.alt = "Close";
  modalPlay.alt = "Play";

  try {
    const filmModal = await films.get(`movie/${movie.id}?language=pt-BR`);
    modalTitle.textContent = filmModal.data.title;

    if (!filmModal.data.overview) {
      modalDescription.textContent = "Filme sem descrição";
    } else {
      modalDescription.textContent = filmModal.data.overview;
    }

    if (!filmModal.data.backdrop_path) {
      modalImg.src = "./assets/noposter.jpg";
    } else {
      modalImg.src = filmModal.data.backdrop_path;
    }

    modalImg.alt = `Poster do filme ${filmModal.data.title}`;
    modalAverage.textContent = filmModal.data.vote_average.toFixed(1);

    filmModal.data.genres.forEach((genre) => {
      const spanGenre = document.createElement("span");
      spanGenre.classList.add("modal__genre");
      spanGenre.textContent = genre.name;
      modalGenre.append(spanGenre);
    });
    const videoYoutube = await films.get(
      `movie/${movie.id}/videos?language=pt-BR`
    );

    if (videoYoutube.data.results.length === 0) {
      modalBody.append(
        btnClose,
        modalTitle,
        divImg,
        modalDescription,
        modalGenreAverage
      );
      divImg.append(modalImg);
    } else {
      modalBody.append(
        btnClose,
        modalTitle,
        aLink,
        modalDescription,
        modalGenreAverage
      );
      aLink.append(divImg);
      divImg.append(modalImg, modalPlay);
      aLink.href = `https://www.youtube.com/watch?v=${videoYoutube.data.results[0].key}`;
      aLink.target = "_blank";
    }
  } catch (error) {
    console.log(error.message);
  }

  btnClose.addEventListener("click", (event) => {
    event.stopPropagation();
    modal.classList.add("hidden");
    modalBody.innerHTML = "";
    while (modalGenre.firstChild) {
      modalGenre.removeChild(modalGenre.firstChild);
    }
  });
}

async function search(event) {
  if (input.value === "" || (event.key === "Enter" && input.value === "")) {
    movies.innerHTML = "";
    try {
      const film = await films.get(
        `discover/movie?language=pt-BR&include_adult=false`
      );
      movieCards(film);
    } catch (error) {
      console.log(error.message);
    }
    return highlight();
  }

  try {
    const search = await films.get(
      `search/movie?language=pt-BR&include_adult=false&query=${input.value.toLowerCase()}`
    );
    movies.innerHTML = "";
    movieCards(search);
    input.value = "";
  } catch (error) {
    console.log(error.message);
  }
}

input.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    search(event);
  }
});

themeBtn.addEventListener("click", () => {
  changeTheme();
});
