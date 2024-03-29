const autocompleteConfiguration = {
    renderOption (movie) {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue (movie) {
        return movie.Title;
    },
    async fetchData (searchTerm) {
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
    }
};

createAutoComplete({
    ...autocompleteConfiguration, 
    root: document.querySelector("#left-autocomplete"), 
    onOptionSelect (movie) {
        // Hide the usage instructions 
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    }
});

createAutoComplete({
    ...autocompleteConfiguration, 
    root: document.querySelector("#right-autocomplete"), 
    onOptionSelect (movie) {
        // Hide the usage instructions 
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    }
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("https://omdbapi.com/", {
        params: {
            apikey: "eeeb0f72",
            i: movie.imdbID
        }
    });

    // Append to the DOM the HTML we created with the movieTemplate helper function (on its respective side of the screen)
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === "left") {
        leftMovie = response.data;
    }
    else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll("#left-summary .notification");
    const rightSideStats = document.querySelectorAll("#right-summary .notification");

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        // If the right side is greater, remove the green colour & add yellow colour to the left side
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        }
        // and viceversa
        else {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
    });
};

const movieTemplate = (movieDetails) => {

    const boxOffice = parseInt(movieDetails.BoxOffice.replace("$", "").replace(/,/g, ""));
    const metaScore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));
    const awards = movieDetails.Awards.split(" ").reduce((previous, word) => {
        // Check if the word is an integer
        const value = parseInt(word);

        if (isNaN(value)) {
            return previous;
        }
        else {
            return previous + value;
        }
    }, 0);

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

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p> 
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${boxOffice} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p> 
            <p class="subtitle">Box Office</p>
        </article>

        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p> 
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p> 
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p> 
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};