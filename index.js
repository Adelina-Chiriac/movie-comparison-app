const fetchData = async (searchTerm) => {
    const response = await axios.get("https://omdbapi.com/", {
        params: {
            apikey: "eeeb0f72",
            s: searchTerm
        }
    });

    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
    <label><b>Search For A Movie!</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");


const onInput = async (event) => {
    const movies = await fetchData(event.target.value);

    if (!movies.length) {
        dropdown.classList.remove("is-active");
        return;
    }

    // Clear out any previous fetched results from the inner HTML of the dropdown menu
    resultsWrapper.innerHTML = "";

    // Add the is-active class so that the dropdown menu will open 
    dropdown.classList.add("is-active");

    for (let movie of movies) {
        const option = document.createElement("a");

        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

        option.classList.add("dropdown-item");
        option.innerHTML = `
            <img src="${imgSrc}" />
            ${movie.Title}
        `;

        option.addEventListener("click", () => {
            dropdown.classList.remove("is-active");
            input.value = movie.Title;

            // Make a follow-up request for the movie the user clicked on
            onMovieSelect(movie);
        });

        // Append each option that we create with movie info to the results wrapper (the div with class of results )
        resultsWrapper.appendChild(option);
    }
};

input.addEventListener("input", debounce(onInput), 500);

document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove("is-active");
    }
});

const onMovieSelect = async (movie) => {
    const response = await axios.get("https://omdbapi.com/", {
        params: {
            apikey: "eeeb0f72",
            i: movie.imdbID
        }
    });

    // Append to the DOM the HTML we created with the movieTemplate helper function
    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetails) => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>

        </article>
    `;
};