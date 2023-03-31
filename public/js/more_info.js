// get the id from the url
const urlParams = new URLSearchParams(window.location.search);
const pokemonNumber = urlParams.get("pokemon");
let pokemonId = parseInt(pokemonNumber);
fetchData();


function fetchData() {
    // fetch the pokemon info
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then((response) => response.json())
        .then((data) => {
            // display the pokemon info
            // showPokemonInfo(data);
            showPokemon(data);
            getType(data);
            getStats(data);
            getAbilities(data);
            getEvolutions(data);
            getCry(data);
            addButtons();
            updateUrl();
            console.log(data);
        });
}


function showPokemon(data)
{
// get the image
const image = document.getElementById("info-image");
image.innerHTML = `<button id="info-shiny"><p>Shiny</p></button>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${data.id}.png" alt="${data.name}">`;

// get the number
const number = document.getElementById("info-number");
number.innerHTML = `#${data.id}`;

// get the name
const name = document.getElementById("info-name");
name.innerHTML = data.name;
}

function getType(data)
{
    console.log(data.types);
// check if the pokemon has 2 types or one
if (data.types.length == 2)
{
// get the type
const type1 = document.getElementById("info-type1");
type1.innerHTML = `<div class="icon ${data.types[0].type.name}">
                    <img src="images/typings/${data.types[0].type.name}.svg">
                    </div>`;
const type2 = document.getElementById("info-type2");
type2.innerHTML = `<div class="icon ${data.types[1].type.name}">
                    <img src="images/typings/${data.types[1].type.name}.svg">
                    </div>`;

}
else
{
// get the type
const type1 = document.getElementById("info-type1");
type1.innerHTML = `<div class="icon ${data.types[0].type.name}">
                    <img src="images/typings/${data.types[0].type.name}.svg">
                    </div>`;
const type2 = document.getElementById("info-type2");
type2.innerHTML = ``;
}
}

function getStats(data)
{
// get the stats
const statLabels = ["info-hp", "info-attack", "info-defense", "info-sp-attack", "info-sp-defense", "info-speed"];

data.stats.forEach((stat, index) => {
  const statElement = document.getElementById(statLabels[index]);
  statElement.innerHTML = `${stat.stat.name} - ${stat.base_stat}`;
});
}

function getAbilities(data)
{
// get the abilities length
const abilitiesLength = data.abilities.length;
const abilities = document.getElementById("info-abilities");
abilities.innerHTML = ``;
// for every ability the pokemon has add it to the list
for (let i = 0; i < abilitiesLength; i++)
{

abilities.innerHTML += `<li>${data.abilities[i].ability.name}</li>`;

}
}

function getEvolutions(data)
{
// get the evolutions url
const evolutionUrl = data.species.url;

fetch(evolutionUrl)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        const evolutionChainUrl = data.evolution_chain.url;
        fetch(evolutionChainUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                showEvolutions(data);
            })
    })
}

async function showEvolutions(data) {
    console.log("werkt");
    const chain = [data.chain];
    let current = data.chain;
  
    while (current.evolves_to.length > 0) {
      current = current.evolves_to[0];
      chain.push(current);
    }

    for (let i = 0; i < 3; i++) {
        const id = `info-evolution${i + 1}`;
        const element = document.getElementById(id);
        element.innerHTML = ``;
      }
  
    for (let i = 0; i < chain.length; i++) {
      const id = `info-evolution${i + 1}`;
      const element = document.getElementById(id);
      const spriteUrl = await getSpriteUrl(chain[i].species.name);
      element.innerHTML = `<li><img src="${spriteUrl}" alt="${chain[i].species.name}">${chain[i].species.name}</li>`;
    }
  }
  
  async function getSpriteUrl(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data.sprites.front_default;
  }
  
  

function getCry(data)
{
    // get the cry
    const cry = document.getElementById("info-cry");
    cry.innerHTML = `<audio src="https://play.pokemonshowdown.com/audio/cries/${data.name}.ogg" controls></audio>`;
}

// add buttons to got to the next and previous pokemon
function addButtons() {
    // Get the pokemon container
    const pokemonContainer = document.getElementById("buttons");

    // Add the buttons to the buttons div with a search bar
    pokemonContainer.innerHTML = `
        <button id="previous" onclick="navigatePkmnMin()" ${pokemonId === 1 ? 'disabled' : ''}><p>Previous</p></button>
        
        <button id="next" onclick="navigatePkmnPlus()"><p>Next</p></button>
    `;
}

// navigate to the next or previous pokemon
function navigatePkmnMin() {

    pokemonId -= 1;
    if (pokemonId < 1) {
        pokemonId = 1;
    }
    fetchData();
}

function navigatePkmnPlus() {
  
    pokemonId += 1;
      fetchData();
  }

function updateUrl() {
    let url = new URL(window.location);
    url.searchParams.set("pokemon", pokemonId);
    window.history.replaceState(null, null, url);
}