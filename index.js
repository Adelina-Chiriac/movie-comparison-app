const fetchData = async (searchTerm) => {
    const response = await axios.get("https://omdbapi.com/", {
        params: {
            apikey: "eeeb0f72",
            s: searchTerm
        }
    });
    console.log(response.data);
};


const input = document.querySelector("input");

const debounce = (func, delay = 500) => {
    let timeoutId;
    return (...args) => {
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const onInput = (event) => {
    fetchData(event.target.value);
};

input.addEventListener("input", debounce(onInput), 500);