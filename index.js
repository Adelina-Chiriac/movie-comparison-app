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
        console.log(movie);
        const option = document.createElement("a");

        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

        option.classList.add("dropdown-item");
        option.innerHTML = `
            <img src="${imgSrc}" />
            ${movie.Title}
        `;
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