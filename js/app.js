const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    console.log(allPokemons);
    renderContent(allPokemons);
  });

async function fetchDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => {
        res.json();
      }),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => {
        res.json();
      }),
    ]);
    return true;
  } catch (error) {
    console.log("Failed to fetch Pokemon data be4 redirect");
  }
}

function renderContent(pokemon) {
  listWrapper.innerHTML = "";

  pokemon.forEach((p) => {
    const pokemonId = p.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
      <div class="number-wrap">
        <p class="caption-fonts">#${pokemonId}</p>
      </div>
      <div class="img-wrap">
        <img 
          src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" 
          alt="${p.name}" 
        />
      </div>
      <div class="name-wrap">
        <p class="body3-fonts">#${p.name}</p>
      </div>
    `;

    listItem.addEventListener("click", async () => {
      const success = await fetchDataBeforeRedirect(pokemonId);

      if (success) {
        window.location.href = `./pages/detail.html?id=${pokemonId}`;
      }
    });

    listWrapper.appendChild(listItem);
  });
}

searchInput.addEventListener("keyup", searchData);

function searchData() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((p) => {
      const pokemonID = p.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((p) =>
      p.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  renderContent(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
  renderContent(allPokemons);
  notFoundMessage.style.display = "none";
}
