// DOM Element Declarations
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
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

const iconURL = "https://openweathermap.org/img/wn/";

let todayTempC = null;
let todayFeelsC = null;
let currentUnit = "C";

// Show an error message
function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}
// hide error message
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

// search button event listener
searchBtn.addEventListener("click", handleSearch);

// get weather by city async await
async function getWeatherByCity(city) {
    hideError();
    if (typeof showLoading === "function") showLoading(true);

    const encodedCity = encodeURIComponent(city);
    const API_KEY = "a07d3ed03bfb746633bc738b0d9e89db";
    const currentLink = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${API_KEY}`;
    const forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=${API_KEY}`;

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
        if (typeof showForecast === "function") showForecast(forecastData);

    } catch (error) {
        showError(error.message);
    } finally {
        if (typeof showLoading === "function") showLoading(false);
    }
}

// Today's weather display
function showTodayWeather(data) {
    todayTempC = data.main.temp;
    todayFeelsC = data.main.feels_like;

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    dateText.textContent = formatDate(new Date());

    weatherIcon.src = `${iconURL}${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;

    condition.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

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

// celcius to fahrenheit
function toFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

// temperature unit update 
function updateTemperatureUnit() {
    if (todayTempC === null) return;
    if (currentUnit === "C") {
        temperature.textContent = Math.round(todayTempC) + "\u00B0C";
        feelsLike.textContent = Math.round(todayFeelsC) + "\u00B0C";
        celciusBtn.classList.add("unit-btn-active");
        toFahrenheitBtn.classList.remove("unit-btn-active");
    } else {
        temperature.textContent = Math.round(toFahrenheit(todayTempC)) + "\u00B0F";
        feelsLike.textContent = Math.round(toFahrenheit(todayFeelsC)) + "\u00B0F";
        toFahrenheitBtn.classList.add("unit-btn-active");
        celciusBtn.classList.remove("unit-btn-active");
    }
}

// temperature switch button
celciusBtn.addEventListener("click", function() {
    currentUnit = "C";
    updateTemperatureUnit();
});
toFahrenheitBtn.addEventListener("click", function() {
    currentUnit = "F";
    updateTemperatureUnit();
});

function showForecast(data) {
  forecastCards.innerHTML = "";

  const middayReadings = [];

  for (let i = 0; i < data.list.length; i++) {
    const item = data.list[i];

    // dt_txt looks like "2026-08-26 12:00:00"
    if (item.dt_txt.indexOf("12:00:00") !== -1) {
      middayReadings.push(item);
    }
  }

  // show at most 5 days
  const days = middayReadings.slice(0, 5);

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const date = new Date(day.dt * 1000);

    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML =
      "<p class='font-bold'>" + formatDate(date) + "</p>" +
      "<img src='" + iconURL + day.weather[0].icon + "@2x.png' alt='" + day.weather[0].description + "' class='w-16 h-16 mx-auto' />" +
      "<p class='text-sm capitalize text-blue-100 mb-2'>" + day.weather[0].description + "</p>" +
      "<div class='forecast-row'><span>\uD83C\uDF21\uFE0F Temp</span><span>" + Math.round(day.main.temp) + " \u00B0C</span></div>" +
      "<div class='forecast-row'><span>\uD83D\uDCA8 Wind</span><span>" + day.wind.speed + " m/s</span></div>" +
      "<div class='forecast-row'><span>\uD83D\uDCA7 Humidity</span><span>" + day.main.humidity + " %</span></div>";

    forecastCards.appendChild(card);
  }

  forecastSection.classList.remove("hidden");
}