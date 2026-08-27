const cityInput=document.getElementById("cityInput");
const searchBtn=document.getElementById("searchBtn");
const errorBox=document.getElementById("errorBox");

// searchBtn.addEventListener("click", function(){
//     console.log("city",cityInput.value);
// })

// show an error message
function showError(message){
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}
// input validation.
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
    // if (!/^[],.'-+$/.test(city)) {
    //     return "Please use letters only in the city name.";
    // }
    return"";
}
// search button
function handleSearch() {
    const text = cityInput.value;
    const message = validateCity(text);

    if (message !== "") {
        showError(message);
        return;
    }
    getWeatherByCity(text.trim());
}
// search button event listener on click
searchBtn.addEventListener("click", handleSearch);


// Get weather by city name

async function getWeatherByCity(city) {

  const encodedCity = encodeURIComponent(city);
  const currentLink = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=a07d3ed03bfb746633bc738b0d9e89db`;
  const forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=a07d3ed03bfb746633bc738b0d9e89db`;

  try {
    // 
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentLink),
      fetch(forecastLink)
    ]);

    // Check for specific errors on the main current weather response
    if (currentResponse.status === 404) 
        throw new Error("City not found. Please check the spelling.");
    if (currentResponse.status === 401) 
        throw new Error("Invalid API key.");
    if (currentResponse.status === 429) 
        throw new Error("Too many requests. Please wait a minute.");
    if (!currentResponse.ok) {
      throw new Error("Could not get the weather right now. Please try again later.");
    }
    // Parse the JSON data for both responses concurrently
    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json()
    ]);

    // Update the UI
    showTodayWeather(currentData);

  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}
function showTodayWeather(data) {
  // save the celsius values so the C / F button can use them later
  todayTempC = data.main.temp;
  todayFeelsC = data.main.feels_like;
}


