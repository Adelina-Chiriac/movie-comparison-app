
const createAutoComplete = ({ root }) => {
    
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

const input = root.querySelector("input");
const dropdown = root.querySelector(".dropdown");
const resultsWrapper = root.querySelector(".results");


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

};