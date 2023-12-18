// Определение интерфейса для фильма
interface Film {
  title: string;
  country: string;
  director: string;
  producer: string;
  composer: string;
  year: string;
  budget: string;
  genre: string;
  duration: string;
  age: string;
  description: string;
  image: string;
}

function handleImageUpload(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files && fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      const imagePreview = document.getElementById("imagePreview") as HTMLImageElement;
      imagePreview.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

// Получение данных из формы и добавление фильма в список
function addFilm(event: Event): void {
  event.preventDefault();

  // Получение значений полей формы
  const titleInput = document.querySelector(".title") as HTMLInputElement;
  const countryInput = document.querySelector(".country") as HTMLInputElement;
  const directorInput = document.querySelector(".director") as HTMLInputElement;
  const producerInput = document.querySelector(".producer") as HTMLInputElement;
  const composerInput = document.querySelector(".composer") as HTMLInputElement;
  const yearInput = document.querySelector(".year") as HTMLInputElement;
  const budgetInput = document.querySelector(".budget") as HTMLInputElement;
  const genreInput = document.querySelector(".genre") as HTMLInputElement;
  const durationInput = document.querySelector(".time") as HTMLInputElement;
  const ageSelect = document.querySelector(".age") as HTMLSelectElement;
  const descriptionInput = document.querySelector(".description") as HTMLTextAreaElement;
  const imageInput = document.querySelector(".image") as HTMLInputElement;
  let imageUrl: string | null = null;

  if (imageInput && imageInput.files && imageInput.files.length > 0) {
    const imageFile = imageInput.files[0];
    imageUrl = URL.createObjectURL(imageFile);
  }

  // Получение ссылки на элемент контейнера фильмов
  const filmContainer = document.getElementById("filmContainer");
  if (filmContainer) {
    // Создание объекта фильма
    const film: Film = {
      title: titleInput.value,
      country: countryInput.value,
      director: directorInput.value,
      producer: producerInput.value,
      composer: composerInput.value,
      year: yearInput.value,
      budget: budgetInput.value,
      genre: genreInput.value,
      duration: durationInput.value,
      age: ageSelect.value,
      description: descriptionInput.value,
      image: imageUrl || "", // Используем пустую строку вместо null, если imageUrl равно null
    };

    // Получение списка фильмов из localStorage
    let films: Film[] = [];
    const storedFilms = localStorage.getItem("films");
    if (storedFilms) {
      films = JSON.parse(storedFilms) as Film[];
    }

    const filmElement = createFilmElement(film);
    filmContainer.appendChild(filmElement);
    // Добавление нового фильма в список
    films.push(film);

    // Сохранение списка фильмов в localStorage
    localStorage.setItem("films", JSON.stringify(films));

    // Очистка полей формы
    titleInput.value = "";
    countryInput.value = "";
    directorInput.value = "";
    producerInput.value = "";
    composerInput.value = "";
    yearInput.value = "";
    budgetInput.value = "";
    genreInput.value = "";
    durationInput.value = "";
    ageSelect.value = "";
    descriptionInput.value = "";
    imageInput.value = "";
    const imagePreview = document.getElementById("imagePreview") as HTMLImageElement;
    imagePreview.src = "";
  }
}

// Создание элемента фильма
function createFilmElement(film: Film): HTMLDivElement {
  const filmElement = document.createElement("div");
  filmElement.classList.add("film");

  const filmImage = document.createElement("img");
  filmImage.classList.add("film-image");
  filmImage.src = film.image;
  filmElement.appendChild(filmImage);

  const filmInfo = document.createElement("div");
  filmInfo.classList.add("film-info");
  filmElement.appendChild(filmInfo);

  const title = document.createElement("h2");
  title.classList.add("film-title");
  title.textContent = film.title;
  filmInfo.appendChild(title);

  const details = document.createElement("p");
  details.classList.add("film-details");
  details.innerHTML = `<strong>Страна:</strong> ${film.country}<br>
                       <strong>Режиссер:</strong> ${film.director}<br>
                       <strong>Продюсер:</strong> ${film.producer}<br>
                       <strong>Композитор:</strong> ${film.composer}<br>
                       <strong>Год:</strong> ${film.year}<br>
                       <strong>Бюджет:</strong> ${film.budget}<br>
                       <strong>Жанр:</strong> ${film.genre}<br>
                       <strong>Продолжительность:</strong> ${film.duration}<br>
                       <strong>Возраст:</strong> ${film.age}`;
  filmInfo.appendChild(details);

  const description = document.createElement("p");
  description.classList.add("film-description");
  description.textContent = film.description;
  filmInfo.appendChild(description);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Удалить";
  filmElement.appendChild(deleteButton);

  deleteButton.addEventListener("click", deleteFilm);

  return filmElement;
}

// Удаление фильма из списка
function deleteFilm(event: Event): void {
  const filmElement = event.currentTarget as HTMLElement;
  const filmContainer = document.getElementById("filmContainer");

  if (filmElement && filmContainer) {
    filmContainer.removeChild(filmElement);

    // Получение списка фильмов из localStorage
    const storedFilms = localStorage.getItem("films");
    if (storedFilms) {
      const films: Film[] = JSON.parse(storedFilms) as Film[];

      // Удаление фильма из списка
      const filmIndex = Array.from(filmContainer.children).indexOf(filmElement);
      if (filmIndex !== -1) {
        films.splice(filmIndex, 1);
      }

      // Сохранение списка фильмов в localStorage
      localStorage.setItem("films", JSON.stringify(films));
    }
  }
}

// Обновление списка фильмов при загрузке страницы
function updateFilmList(): void {
  const filmContainer = document.getElementById("filmContainer");
  if (filmContainer) {
    // Получение списка фильмов из localStorage
    const storedFilms = localStorage.getItem("films");
    if (storedFilms) {
      const films: Film[] = JSON.parse(storedFilms) as Film[];

      // Создание элементов для каждого фильма
      const filmElements = films.map(createFilmElement);

      // Добавление элементов в контейнер фильмов
      filmElements.forEach((element) => {
        filmContainer.appendChild(element);
      });
    }
  }
}

// Обработчик события загрузки страницы
window.addEventListener("load", updateFilmList);

// Обработчик события отправки формы
const addButton = document.getElementById("addButton");
if (addButton) {
  addButton.addEventListener("click", addFilm);
}

// Обработчик события загрузки изображения
const imageInput = document.getElementById("imageInput");
if (imageInput) {
  imageInput.addEventListener("change", handleImageUpload);
}
