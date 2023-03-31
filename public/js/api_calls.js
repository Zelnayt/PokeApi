getPokemon("https://pokeapi.co/api/v2/pokemon");

// Get the pokemon from the API
function getPokemon(url) {
    // Fetch the pokemon data
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // Display the pokemon
            showPokemon(data);
            console.log(data);
        });

        

}

function showPokemon(data) {
    
    // Get the pokemon container
    const pokemonContainer = document.getElementById("pokemon-container");

    // Clear the pokemon container
    pokemonContainer.innerHTML = "";

    // Loop through the pokemon
    data.results.forEach((pokemon) => {
        // Create a div for the pokemon
        const pokemonDiv = document.createElement("div");

        // Add a class to the pokemon div
        pokemonDiv.classList.add("pokemon");

        // Add an id to the pokemon div
        pokemonDiv.id = "pokemon-card";

        // Variable to store the pokemon number
        let pokemonNumber = pokemon.url.split("/")[6];

        // Add the pokemon image to the div
        pokemonDiv.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonNumber}.png" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            `;

        // Add the pokemon div to the pokemon container
        pokemonContainer.appendChild(pokemonDiv);
        pokemonDiv.onclick = () => getInfo(pokemonNumber);
        const number = document.createElement("div");
        number.id = "pokemonNumber";
        number.innerHTML = `<p>${pokemonNumber}</p>`;
        pokemonDiv.appendChild(number);
    });

    // Add the next and previous buttons
    addButtons(data.previous, data.next);
}

// Add the next and previous buttons
function addButtons(previous, next) {
    // Get the pokemon container
    const pokemonContainer = document.getElementById("buttons");

    // Add the buttons to the buttons div with a search bar
    pokemonContainer.innerHTML = `
        <button id="previous" onclick="getPokemon('${previous}')" ${previous == null ? 'disabled' : ''}><p>Previous</p></button>
        
        <button id="next" onclick="getPokemon('${next}')"><p>Next</p></button>
    `;
}

// Search for a pokemon
function searchPokemon() {
    // Get the search input
    const searchInput = document.getElementById("search").value;

    // Get the pokemon container
    const pokemonContainer = document.getElementById("pokemon-container");

    // Get all the pokemon divs
    const pokemonDivs = pokemonContainer.querySelectorAll(".pokemon");

    // Loop through the pokemon divs
    pokemonDivs.forEach((pokemonDiv) => {
        // Get the pokemon name
        const pokemonName = pokemonDiv.querySelector("h2").innerText;

        // Check if the pokemon name contains the search input
        if (pokemonName.toLowerCase().includes(searchInput.toLowerCase())) {
            // Show the pokemon
            pokemonDiv.style.display = "block";
        } else {
            // Hide the pokemon
            pokemonDiv.style.display = "none";
        }
    });
}

// Get the pokemon info
function getInfo(pokemonNumber) {
    console.log(pokemonNumber);
    // go to the pokemon info page
    window.location.href = `./pokemon.html?pokemon=${pokemonNumber}`;
}