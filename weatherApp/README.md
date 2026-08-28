Weather Forecast App built with HTML, Tailwind CSS and plain JavaScript. You type a city name. ( Press the "My Location" button) and the page shows todays weather along with a 5-day forecast. The weather data comes from the OpenWeatherMap API.

Features

- Search the weather by city name
- Get the weather for your location using the browsers geolocation
- Todays card shows temperature, weather condition, humidity, wind speed feels-like and pressure
- Temperature unit toggle (C / F). It changes todays temperature only the forecast cards stay in Celsius
- 5-day forecast cards with the date, temperature, wind and humidity each with its icon
- Dropdown of the last 5 searched cities saved in `localStorage`. The dropdown does not appear all until a city has been searched and there is a "Clear" button to empty it
- Choosing a city from the dropdown loads that citys weather again
- Input validation for empty too short, numeric and symbol-only searches
- Extreme temperature alert: a warning bar appears above 40 C or below 0 C
- All errors (wrong city, bad API key, rate limit, network failure) are shown in a red box on the page. `Alert()` is not used anywhere, in the project
- layout that works on desktop, tablet and small phones
- Weather icons come from OpenWeatherMap
- Dynamic background

GIT HUB LINK: https://github.com/dapoojary9/Project/tree/main/weatherApp
