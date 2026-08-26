const cityInput=document.getElementById("cityInput");
const searchBtn=document.getElementById("searchBtn");
const errorBox=document.getElementById("errorBox");

// searchBtn.addEventListener("click", function(){
//     console.log("city",cityInput.value);
// })

function showError(message){
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

function validateCity(text) {
    const city =text.trim();

    if(city ==="") {
        return "Please enter a city name.";
    }
    if(city.length < 2) {
        return "City name is too short. Please enter at least 2 letters";
    }
    if (!isNaN(city)) {
        return "Numbers are not a city name. Please type a city name.";
    }
    if (!/^[]a-zA-Z\s,.'-+$/.test(city)) {
        return "Please use letters only in the city name.";
    }
    return"";
}

function handleSearch() {
    const text = cityInput.value;
    const message = validateCity(text);

    if (message !== "") {
        showError(message);
        return;
    }
    getWeatherByCity(text.trim());
}
searchBtn.addEventListener("click", handleSearch);
