/************ SELECCIÓN DE ELEMENTOS DEL DOM ************/
const pokemonName = document.querySelector('.pokemon-name');
const pokemonNumber = document.querySelector('.pokemon-number');
const pokemonImage = document.querySelector('.pokemon-image');
const pokemonType = document.querySelector('.pokemon-type');
const pokemonHeight = document.querySelector('.pokemon-height');
const pokemonWeight = document.querySelector('.pokemon-weight');
const pokemonAbilities = document.querySelector('.pokemon-abilities');
const pokemonStats = document.querySelector('.pokemon-stats');
const pokemonCaptureRate = document.querySelector('.pokemon-capture');
const pokemonHabitat = document.querySelector('.pokemon-habitat');
const pokemonEvolution = document.querySelector('.pokemon-evolution');

const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

const logoButtonOpen = document.getElementById('open');
const logoButtonClose = document.getElementById('close');
const logoDiv = document.getElementById('logo');

/************ VARIABLES GLOBALES ************/
let searchPokemon = 1; // Pokémon inicial

/************ FUNCIONES DE CONVERSIÓN ************/
// Convierte hectogramos a kilogramos
const convertWeight = (weight) => weight / 10; 

// Convierte decímetros a metros
const convertHeight = (height) => height / 10;

// Capitaliza la primera letra de una palabra
const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/************ FUNCIONES DE API ************/
// Obtiene los datos de un Pokémon desde la PokeAPI
const fetchPokemon = async (pokemon) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (!response.ok) throw new Error('No encontrado');
    return await response.json();
  } catch (error) {
    return null;
  }
};

// Obtiene datos adicionales de la especie del Pokémon
const fetchPokemonSpecies = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
};

// Reproduce el sonido del Pokémon
const playPokemonCry = (pokemon) => {
  const audio = new Audio(`https://play.pokemonshowdown.com/audio/cries/${pokemon}.ogg`);
  audio.play();
};

/************ FUNCIÓN PARA RENDERIZAR DATOS DEL POKÉMON ************/
const renderPokemon = async (pokemon) => {
  // Mostrar pantalla de carga
  document.getElementById('loading-screen').style.display = 'block';
  document.getElementById('image-loading').style.display = 'block';
  document.querySelectorAll('#stats .column').forEach(column => column.style.display = 'none');
  pokemonImage.style.display = 'none';

  // Obtener datos del Pokémon
  const data = await fetchPokemon(pokemon);
  if (!data) {
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
    pokemonImage.style.display = 'none';
    return;
  }

  // Ocultar pantalla de carga y mostrar datos
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('image-loading').style.display = 'none';
  document.querySelectorAll('#stats-screen .column').forEach(column => column.style.display = 'block');
  pokemonImage.style.display = 'block';

  // Asignar datos al HTML
  pokemonName.innerHTML = capitalizeFirstLetter(data.name);
  pokemonNumber.innerHTML = data.id;
  pokemonHeight.innerHTML = convertHeight(data.height) + " m";
  pokemonWeight.innerHTML = convertWeight(data.weight) + " kg";
  pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
  playPokemonCry(data.name.toLowerCase());

  // Mostrar tipos del Pokémon
  pokemonType.innerHTML = '';
  data.types.forEach(typeData => {
    const typeSpan = document.createElement('span');
    typeSpan.classList.add('pokemon-type', typeData.type.name);
    typeSpan.textContent = capitalizeFirstLetter(typeData.type.name);
    pokemonType.appendChild(typeSpan);
  });

  // Mostrar habilidades
  pokemonAbilities.innerHTML = data.abilities.map(a => capitalizeFirstLetter(a.ability.name)).join(', ');

  // Mostrar estadísticas
  pokemonStats.innerHTML = `
    <li><p class="stat-hp">HP: ${data.stats[0].base_stat}</p></li>
    <li><p class="stat-attack">Attack: ${data.stats[1].base_stat}</p></li>
    <li><p class="stat-defense">Defense: ${data.stats[2].base_stat}</p></li>
    <li><p class="stat-speed">Speed: ${data.stats[5].base_stat}</p></li>
  `;

  // Obtener y mostrar datos extra de la especie
  const speciesData = await fetchPokemonSpecies(data.id);
  if (speciesData) {
    pokemonCaptureRate.innerHTML = speciesData.capture_rate;
    pokemonHabitat.innerHTML = speciesData.habitat ? capitalizeFirstLetter(speciesData.habitat.name) : 'Unknown';
    pokemonEvolution.innerHTML = speciesData.evolves_from_species ? capitalizeFirstLetter(speciesData.evolves_from_species.name) : 'None';
  }

  searchPokemon = data.id;
};

/************ FUNCIONES DE BÚSQUEDA ************/
const clearSearch = () => {
  input.value = '';  
  searchPokemon = 1; 
  renderPokemon(searchPokemon);
};

const searchPokemonByInput = () => {
  let searchQuery = input.value.trim().toLowerCase();
  if (!searchQuery) return;
  if (!isNaN(searchQuery)) searchQuery = parseInt(searchQuery, 10);
  renderPokemon(searchQuery);
};

/************ EVENTOS DE BÚSQUEDA Y NAVEGACIÓN ************/
form.addEventListener('submit', (event) => {
  event.preventDefault();
  searchPokemonByInput();
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

/************ EVENTOS DE INTERFAZ ************/
// Mostrar elementos al abrir la pokédex
logoButtonOpen.addEventListener('click', () => {
  logoDiv.style.display = 'none';
  document.querySelectorAll('div#right, div#screen, div#big-black-button, div#search-button1, div#search-button2, div#cross, form#search')
    .forEach(element => element.style.display = 'block');
});

// Ocultar elementos al cerrar la pokédex
logoButtonClose.addEventListener('click', () => {
  logoDiv.style.display = 'block';
  document.querySelectorAll('div#right, div#screen, div#big-black-button, div#search-button1, div#search-button2, div#cross, form#search')
    .forEach(element => element.style.display = 'none');
});

// Event listener para el botón "open"
document.getElementById('open').addEventListener('change', () => {
  if (document.getElementById('open').checked && searchPokemon) {
    renderPokemon(searchPokemon);
  }
});

// Botones de borrar y buscar
document.getElementById('search-button2').addEventListener('click', clearSearch);
document.getElementById('search-button1').addEventListener('click', searchPokemonByInput);

// Renderizar el Pokémon inicial
renderPokemon(searchPokemon);