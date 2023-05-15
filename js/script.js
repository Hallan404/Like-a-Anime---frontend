// Buscando os generos na api
let genresObj = {};
fetch("https://api.jikan.moe/v4/genres/anime")
  .then((response) => response.json())
  .then((data) => {
    const genres = data.data.map((item) => ({
      name: item.name,
      id: item.mal_id,
      current_page: item.current_page,
      total_pages: item.last_visible_page,
    }));

    for (let i = 0; i < genres.length; i++) {
      const category_option = document.createElement("option");
      category_option.textContent = `${genres[i].name}`;
      categories.appendChild(category_option);
    }
    genresObj = genres;
  })
  .catch((error) => console.error(error));

// mostrando o titulo de cada categoria na label
const selectElement = document.getElementById("categories");
const titleElement = document.querySelector(".category-title");
let current_id;
const change_cards = (name) => {
  genresObj.forEach((element) => {
    if (name == element.name) {
      perGenre(element.id, 1);
      current_id = element.id;
    }
  });
};
selectElement.addEventListener("change", function () {
  const selectedOption = this.options[this.selectedIndex];
  titleElement.textContent = selectedOption.textContent;
  change_cards(selectedOption.textContent);
});

const div_per_category = document.querySelector(".cards-wrapper");
const div_popular = document.querySelector(".top-animes-cards");
const initial_page = document.querySelector(".txt-initial");
const last_page = document.querySelector(".txt-final");
const perGenre = (genreId, page) => {
  div_per_category.innerHTML = "";
  div_popular.innerHTML = "";
  initial_page.innerHTML = "";
  fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      initial_page.textContent = data.pagination.current_page;
      last_page.textContent = data.pagination.last_visible_page;

      const information_anime = data.data.map((item) => ({
        image: item.images.webp.image_url,
        title: item.title_english ? item.title_english : item.title,
        popularity: item.popularity,
        description: item.synopsis,
      }));
      // Criando os cards de todos os animes
      for (let i = 0; i < information_anime.length; i++) {
        const img_anime = document.createElement("img");
        img_anime.src = `${information_anime[i].image}`;
        img_anime.className = "img-card";
        const label_anime = document.createElement("label");
        label_anime.textContent = `${information_anime[i].title}`;
        label_anime.className = "title-card";
        const anime_description = document.createElement("p");
        anime_description.textContent = `${information_anime[i].description}`;
        const card = document.createElement("div");
        card.className = "card";
        card.appendChild(img_anime);
        card.appendChild(label_anime);
        div_per_category.appendChild(card);
        // adiciona evento de clique para mostrar modal
        card.addEventListener("click", () => {
          // Abrindo o modal
          const modal = document.getElementById("modal");
          modal.style.display = "block";

          // Exibibindo as informações do anime correspondente

          const modalContent = modal.querySelector(".modal-content");
          modalContent.innerHTML = `
          <h1 class="close-modal">x</h1>
         <h2>${label_anime.textContent}</h2>
      <img src="${img_anime.getAttribute("src")}">
      <button class='add-favorite' >Adicionar aos Favoritos</button>
      <p class="modal-text">${anime_description.textContent}</p>
      <!-- Adicione outras informações do anime aqui -->
    `;
          const addToFavorite = () => {
            const loged_user_id = localStorage.getItem("loged_user_id");
            const categia_do_anime = document.querySelector(".category-title");
            const anime = {
              nome: label_anime.textContent,
              categoria: categia_do_anime.textContent,
            };

            fetch(
              `http://hallandeoliveira.pythonanywhere.com/usuarios/atualizar/${loged_user_id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ animes_preferidos: [anime] }),
              }
            )
              .then((response) => response.json())
              .then((data) => console.log(data))
              .catch((error) => console.error());
          };

          const addFavoriteButton = modalContent.querySelector(".add-favorite");
          addFavoriteButton.onclick = addToFavorite;
          // Adicionando um evento de clique para fechar o modal quando o usuário clicar no botão de fechar
          const closeModalButton = document.querySelector(".close-modal");
          // Verificando se o botão de fechar foi encontrado
          if (closeModalButton) {
            // Adicionando um evento de clique para fechar o modal quando o usuário clicar no botão de fechar
            closeModalButton.addEventListener("click", () => {
              const modal = document.getElementById("modal");
              modal.style.display = "none";
            });
          }
        });
      }

      // Criando os cards para os mais populares
      information_anime.sort((a, b) => b.popularity - a.popularity);

      for (let i = 0; i < 4 && i < information_anime.length; i++) {
        const img_anime = document.createElement("img");
        img_anime.src = `${information_anime[i].image}`;
        img_anime.className = "img-card";
        const label_anime = document.createElement("label");
        label_anime.textContent = `${information_anime[i].title}`;
        label_anime.className = "title-card";
        const card = document.createElement("div");
        card.className = "card-top";
        card.appendChild(img_anime);
        card.appendChild(label_anime);
        div_popular.appendChild(card);
      }
    })
    .catch((error) => console.error(error));
};

// Criando paginação no rodapé
const change_page = (direction) => {
  let current = Number(initial_page.innerHTML);
  let total = Number(last_page.innerHTML);

  if (current > 1 && direction == "minus") {
    perGenre(current_id, current - 1);
  }
  if (current < total && direction == "plus") {
    perGenre(current_id, current + 1);
  }
  console.log(current);
};

perGenre(1, 1);

//   https://api.jikan.moe/v4/anime?genres= para pegar os animes por genero

// https://api.jikan.moe/v4/anime/{id} para pegar por id (listar todos os ids com um fetch geral)
// se for pra escolher titulo , se não tiver english usar default
// 985 paginas de animesfazer um fetch prévio para ter todos os animes com nome e id guardados para não precisar buscar sempre na api
// https://themewagon.github.io/anime/categories.html sample
