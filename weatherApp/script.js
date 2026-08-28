// DOM Element Declarations
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn"); 
const errorBox = document.getElementById("errorBox");
const cityName = document.getElementById("cityName");
const dateText = document.getElementById("dateText");
const weatherIcon = document.getElementById("weatherIcon");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const today = document.getElementById("today");
const celciusBtn = document.getElementById("celciusBtn");
const toFahrenheitBtn = document.getElementById("toFahrenheitBtn");
const forecastSection = document.getElementById("forecastSection");
const forecastCards = document.getElementById("forecastCards");
const historyBox = document.getElementById("historyBox");
const historySelect = document.getElementById("historySelect");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const tempAlert = document.getElementById("tempAlert");

// API Configuration Constants
const API_KEY = "a07d3ed03bfb746633bc738b0d9e89db";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const ICON_URL = "https://openweathermap.org/img/wn/";

let todayTempC = null;
let todayFeelsC = null;
let currentUnit = "C";

//Show Loading Indicator
function handleLoading(isLoading) {
    if (typeof showLoading === "function") {
        showLoading(isLoading);
    }
}

// Show an error message
function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

// Hide error message
function hideError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
}

// Input validation
function validateCity(text) {
    const city = text.trim();

    if (city === "") {
        return "Please enter a city name.";
    }
    if (city.length < 2) {
        return "City name is too short. Please enter at least 2 letters.";
    }
    if (!isNaN(city)) {
        return "Numbers are not a city name. Please type a city name.";
    }
    if (!/^[a-zA-Z\u00C0-\u024F\s'.\-,]+$/.test(city)) {
    return "Only letters, spaces, apostrophes and hyphens are allowed.";
  }
    return "";
}

// Search button handler
function handleSearch() {
    const text = cityInput.value;
    const message = validateCity(text);

    if (message !== "") {
        showError(message);
        return;
    }
    getWeatherByCity(text.trim());
}

// Search button event listener
if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch);
}

// Fetch weather by city name
async function getWeatherByCity(city) {
    hideError();
    handleLoading(true);

    const encodedCity = encodeURIComponent(city);
    const currentLink = `${CURRENT_URL}?q=${encodedCity}&units=metric&appid=${API_KEY}`;
    const forecastLink = `${FORECAST_URL}?q=${encodedCity}&units=metric&appid=${API_KEY}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentLink),
            fetch(forecastLink)
        ]);

        if (currentResponse.status === 404) 
            throw new Error("City not found. Please check the spelling.");
        if (currentResponse.status === 401) 
            throw new Error("Invalid API key.");
        if (currentResponse.status === 429) 
            throw new Error("Too many requests. Please wait a minute.");
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Could not get the weather right now. Please try again later.");
        }

        const [currentData, forecastData] = await Promise.all([
            currentResponse.json(),
            forecastResponse.json()
        ]);
        
        showTodayWeather(currentData);
        showForecast(forecastData);
        addRecentCity(currentData.name);

    } catch (error) {
        showError(error.message);
    } finally {
        handleLoading(false);
    }
}

// Today's weather display
function showTodayWeather(data) {
    todayTempC = data.main.temp;
    todayFeelsC = data.main.feels_like;

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    dateText.textContent = formatDate(new Date());

    weatherIcon.src = `${ICON_URL}${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;

    condition.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    updateBackground(data.weather[0].main, data.weather[0].description);

    updateTemperatureUnit();
    if (typeof checkTemperatureAlert === "function") checkTemperatureAlert(todayTempC);

    today.classList.remove("hidden");
}

// Date formatting
function formatDate(dateObject) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[dateObject.getDay()]}, ${dateObject.getDate()} ${months[dateObject.getMonth()]}`;
}

// Celsius to Fahrenheit conversion
function toFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

// Temperature unit update 
function updateTemperatureUnit() {
    if (todayTempC === null) return;

    if (currentUnit === "C") {
        temperature.textContent = Math.round(todayTempC) + "\u00B0C";
        feelsLike.textContent = Math.round(todayFeelsC) + "\u00B0C";
        if (celciusBtn) celciusBtn.classList.add("unit-btn-active");
        if (toFahrenheitBtn) toFahrenheitBtn.classList.remove("unit-btn-active");
    } else {
        temperature.textContent = Math.round(toFahrenheit(todayTempC)) + "\u00B0F";
        feelsLike.textContent = Math.round(toFahrenheit(todayFeelsC)) + "\u00B0F";
        if (toFahrenheitBtn) toFahrenheitBtn.classList.add("unit-btn-active");
        if (celciusBtn) celciusBtn.classList.remove("unit-btn-active");
    }

}

// Temperature switch buttons
if (celciusBtn) {
    celciusBtn.addEventListener("click", function() {
        currentUnit = "C";
        updateTemperatureUnit();
    });
}

if (toFahrenheitBtn) {
    toFahrenheitBtn.addEventListener("click", function() {
        currentUnit = "F";
        updateTemperatureUnit();
    });
}

// 5 days forecast cards
function showForecast(data) {
    if (!forecastCards || !forecastSection) return;
    forecastCards.innerHTML = "";

    const middayReadings = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    const days = middayReadings.slice(0, 5);

    days.forEach(day => {
        const date = new Date(day.dt * 1000);
        const tempDisplay = currentUnit === "C" 
            ? Math.round(day.main.temp) + " \u00B0C" 
            : Math.round(toFahrenheit(day.main.temp)) + " \u00B0F";

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML =
            `<p class='font-bold'>${formatDate(date)}</p>` +
            `<img src='${ICON_URL}${day.weather[0].icon}@2x.png' alt='${day.weather[0].description}' class='w-16 h-16 mx-auto' />` +
            `<p class='text-sm capitalize text-blue-100 mb-2'>${day.weather[0].description}</p>` +
            `<div class='forecast-row'><span>\uD83C\uDF21\uFE0F Temp</span><span>${tempDisplay}</span></div>` +
            `<div class='forecast-row'><span>\uD83D\uDCA8 Wind</span><span>${day.wind.speed} m/s</span></div>` +
            `<div class='forecast-row'><span>\uD83D\uDCA7 Humidity</span><span>${day.main.humidity} %</span></div>`;

        forecastCards.appendChild(card);
    });

    forecastSection.classList.remove("hidden");
}

// Recent Cities Local Storage
const STORAGE_KEY = "recentCities";
let recentCitiesBackup = [];

function getRecentCities() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === null) return recentCitiesBackup;
        return JSON.parse(saved);
    } catch (error) {
        return recentCitiesBackup;
    }
}

function saveRecentCities(list) {
    recentCitiesBackup = list;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (error) {}
}

function addRecentCity(city) {
    let list = getRecentCities();

    list = list.filter(item => item.toLowerCase() !== city.toLowerCase());
    list.unshift(city);
    list = list.slice(0, 5);

    saveRecentCities(list);
    showRecentCities();
}

function showRecentCities() {
    if (!historyBox || !historySelect) return;
    const list = getRecentCities();

    if (list.length === 0) {
        historyBox.classList.add("hidden");
        historySelect.innerHTML = "";
        return;
    }

    historySelect.innerHTML = "<option value=''>Select a city</option>";

    list.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        historySelect.appendChild(option);
    });

    historyBox.classList.remove("hidden");
}

function clearRecentCities() {
    recentCitiesBackup = [];
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {}
    showRecentCities();
}

// Event Listeners for History Dropdown
if (historySelect) {
    historySelect.addEventListener("change", function () {
        const city = historySelect.value;
        if (city !== "") { 
            cityInput.value = city;
            getWeatherByCity(city);
        }
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", clearRecentCities);
}

// Fetch weather by location coordinates
async function getWeatherByCoords(lat, lon) {
    hideError();
    handleLoading(true);

    const currentLink = `${CURRENT_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const forecastLink = `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentLink),
            fetch(forecastLink)
        ]);

        if (currentResponse.status === 401) {
            throw new Error("Invalid API key.");
        }
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Could not get weather for your location.");
        }

        const [currentData, forecastData] = await Promise.all([
            currentResponse.json(),
            forecastResponse.json()
        ]);

        showTodayWeather(currentData);
        showForecast(forecastData);
        addRecentCity(currentData.name);

    } catch (error) {
        showError(error.message);
    } finally {
        handleLoading(false);
    }
}

// Geolocation Handler
function useMyLocation() {
    hideError();

    if (!navigator.geolocation) {
        showError("Your browser does not support location search.");
        return;
    }

    handleLoading(true);

    navigator.geolocation.getCurrentPosition(
        function (position) {
            getWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        function () {
            handleLoading(false);
            showError("Location permission was denied. Please search by city name instead.");
        }
    );
}

if (locationBtn) {
    locationBtn.addEventListener("click", useMyLocation);
}

// Dynamic background image update based on weather condition
function updateBackground(weatherMain) {
    const main = weatherMain.toLowerCase();

    // Map weather conditions to image URLs (Unsplash direct links)
    const images = {
        rain: "./assets/rain.jpg",
        clear: "./assets/clear.jpg",
        clouds: "./assets/clouds.jpg",
        snow: "./assets/snow.jpg",
        default: "./assets/default.jpg"
    };

    let selectedImage = images.default;

    if (main.includes("rain") || main.includes("drizzle") || main.includes("thunderstorm")) {
        selectedImage = images.rain;
    } else if (main.includes("clear")) {
        selectedImage = images.clear;
    } else if (main.includes("cloud") || main.includes("mist") || main.includes("fog") || main.includes("haze")) {
        selectedImage = images.clouds;
    } else if (main.includes("snow")) {
        selectedImage = images.snow;
    }

// Apply dark overlay + background image styles
    document.body.style.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url('${selectedImage}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
}

// extreme temp alert
function checkTemperatureAlert(tempC) {
  if (tempC > 40) {
    tempAlert.textContent = "⚠️ Heat alert: temperature is above 40 C. Please stay indoors and drink water.";
    tempAlert.classList.remove("hidden");
  } else if (tempC < 0) {
    tempAlert.textContent = "❄️ Cold alert: temperature is below 0 C. Please wear warm clothes.";
    tempAlert.classList.remove("hidden");
  } else {
    tempAlert.classList.add("hidden");
  }
}

// Initializations
showRecentCities();
getWeatherByCity("udupi");