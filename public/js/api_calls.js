getPokemon("https://pokeapi.co/api/v2/pokemon");

// Get the Pokémon using fetch
function getPokemon(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            showPokemon(data);
            console.log(data);
        });
}

function showPokemon(data) {
    // Here we get the 20 Pokémon and put them in the div
    const pokemonContainer = document.getElementById("pokemon-container");
    pokemonContainer.innerHTML = "";

    // Loop through the pokemon
    data.results.forEach((pokemon) => {
        const pokemonDiv = document.createElement("div");
        pokemonDiv.classList.add("pokemon");
        pokemonDiv.id = "pokemon-card";
        let pokemonNumber = pokemon.url.split("/")[6];

        // Add the pokemon image to the div
        pokemonDiv.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonNumber}.png" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            `;

        // Add the pokemon div to the pokemon container
        pokemonContainer.appendChild(pokemonDiv);

        // When clicking on this, we go to the information page
        pokemonDiv.onclick = () => getInfo(pokemonNumber);

        const number = document.createElement("div");
        number.id = "pokemonNumber";
        number.innerHTML = `<p>${pokemonNumber}</p>`;
        pokemonDiv.appendChild(number);
    });

    // Add the next and previous buttons
    addButtons(data.previous, data.next);
}

function addButtons(previous, next) {
    const pokemonContainer = document.getElementById("buttons");
    pokemonContainer.innerHTML = `
        <button id="previous" onclick="getPokemon('${previous}')" ${previous == null ? 'disabled' : ''}><p>Previous</p></button>
        <button id="next" onclick="getPokemon('${next}')"><p>Next</p></button>
    `;
}

// Get the pokemon info
function getInfo(pokemonNumber) {
    console.log(pokemonNumber);
    // go to the pokemon info page
    window.location.href = `./pokemon.html?pokemon=${pokemonNumber}`;
}