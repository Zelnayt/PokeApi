// We first get the id through the URL
const urlParams = new URLSearchParams(window.location.search);
const pokemonNumber = urlParams.get("pokemon");
let pokemonId = parseInt(pokemonNumber);
fetchData();

// Then we fetch and call all the functions needed to show the information
function fetchData() {
	fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
      
			addButtons();
      updateUrl();
      showPokemon(data);
      getType(data);
      getStats(data);
      getEvolutions(data);
      getAbilities(data);
      getCry(data);
		});
}

// Her we add buttons to got to the next and previous pokemon
function addButtons() {
	const pokemonContainer = document.getElementById("buttons");
	pokemonContainer.innerHTML = `
        <button id="previous" onclick="navigatePkmnMin()" ${pokemonId === 1 ? 'disabled' : ''}><p>Previous</p></button>
        <button id="next" onclick="navigatePkmnPlus()"><p>Next</p></button>
    `;
}

// These two functions are the ones who actually navigate
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

// This function just makes sure the URL still contains the right information
function updateUrl() {
	let url = new URL(window.location);
	url.searchParams.set("pokemon", pokemonId);
	window.history.replaceState(null, null, url);
}

// This functions gets the Name, Number and Image
function showPokemon(data) {
  const name = document.getElementById("info-name");
	name.innerHTML = data.name;
	const number = document.getElementById("info-number");
	number.innerHTML = `#${data.id}`;
	const image = document.getElementById("info-image");
	image.innerHTML = `
        <button id="info-shiny" onclick="toggleShiny()"><p>Normal</p></button>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${data.id}.png" alt="${data.name}">
    `;
}

// This Function makes it so the user can toggle between the normal sprite and the shiny sprite
var shiny = false;
function toggleShiny() {
	const id = document.getElementById("info-number").innerHTML;
	const idNumber = id.substring(1);

	if (shiny == false) {
		shiny = true;
		console.log("normal");
		const image = document.getElementById("info-image");
		image.innerHTML = `<button id="info-shiny" onclick="toggleShiny()"><p>Shiny</p></button>
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${idNumber}.png" alt="${idNumber}">`;
	} else {
		shiny = false;
		console.log("shiny");
		const image = document.getElementById("info-image");
		image.innerHTML = `<button id="info-shiny" onclick="toggleShiny()"><p>Normal</p></button>
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${idNumber}.png" alt="${idNumber}">`;
	}
}

// This function gets the typings of the Pokémon
function getType(data) {
	console.log("Type of the Pokémon: " + data.types);

  // We check how many typings the Pokémon has
	if (data.types.length == 2) {
		const type1 = document.getElementById("info-type1");
		type1.innerHTML = `<div class="icon ${data.types[0].type.name}">
                    <img src="images/typings/${data.types[0].type.name}.svg">
                    </div>`;
		const type2 = document.getElementById("info-type2");
		type2.innerHTML = `<div class="icon ${data.types[1].type.name}">
                    <img src="images/typings/${data.types[1].type.name}.svg">
                    </div>`;
	} else {
		const type1 = document.getElementById("info-type1");
		type1.innerHTML = `<div class="icon ${data.types[0].type.name}">
                    <img src="images/typings/${data.types[0].type.name}.svg">
                    </div>`;
		const type2 = document.getElementById("info-type2");
		type2.innerHTML = ``;
	}
}

// This function gets the stats of the Pokémon
function getStats(data) {
	const statLabels = ["info-hp", "info-attack", "info-defense", "info-sp-attack", "info-sp-defense", "info-speed"];

	data.stats.forEach((stat, index) => {
		const statElement = document.getElementById(statLabels[index]);
		statElement.innerHTML = `${stat.stat.name} - ${stat.base_stat}`;
	});
}

// Here we get the evolution chain data (1/3)
function getEvolutions(data) {
	const evolutionUrl = data.species.url;

	fetch(evolutionUrl)
		.then((response) => response.json())
		.then((data) => {
			console.log("Evolution 1: " + data);
			const evolutionChainUrl = data.evolution_chain.url;
			fetch(evolutionChainUrl)
				.then((response) => response.json())
				.then((data) => {
					console.log("Evolution 2: " + data);
					showEvolutions(data);
				})
		})
}

// Then we retrieve all the names of the chain (2/3)
async function showEvolutions(data) {
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
    // Now we call the last function for the chain
		const spriteUrl = await getSpriteUrl(chain[i].species.name);
		element.innerHTML = `<li><img src="${spriteUrl}" alt="${chain[i].species.name}">${chain[i].species.name}</li>`;
	}
}

// We get the sprites of the chain (3/3)
async function getSpriteUrl(name) {
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
	const data = await response.json();
	return data.sprites.front_default;
}

// Here we get all the possible abilities the Pokémon can have
function getAbilities(data) {
	const abilitiesLength = data.abilities.length;
	const abilities = document.getElementById("info-abilities");
	abilities.innerHTML = ``;

	for (let i = 0; i < abilitiesLength; i++) {
		abilities.innerHTML += `<li>${data.abilities[i].ability.name}</li>`;
	}
}

// Here we get the Pokémon cry
function getCry(data) {
	const cry = document.getElementById("info-cry");
	cry.innerHTML = `<audio src="https://play.pokemonshowdown.com/audio/cries/${data.name}.ogg" controls></audio>`;
}