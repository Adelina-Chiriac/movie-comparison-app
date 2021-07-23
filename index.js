const fetchData = async () => {
    const response = await axios.get("https://omdbapi.com/", {
        params: {
            apikey: "eeeb0f72",
            s: "The Shining"
        }
    });
    console.log(response.data);
};

fetchData();
