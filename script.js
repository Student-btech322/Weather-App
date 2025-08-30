document.addEventListener('DOMContentLoaded', () => {
    // --- 1. API and DOM Elements ---
    const apiKey = '554f9be8f609d05155a890145a04b63a'; // <-- IMPORTANT: Replace with your OpenWeatherMap API key
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

    // DOM Elements
    const locationForm = document.getElementById('location-form');
    const locationInput = document.getElementById('location-input');
    const weatherDisplay = document.getElementById('weather-display');
    const errorContainer = document.getElementById('error-container');
    const errorMessageEl = document.getElementById('error-message');
    const loader = document.getElementById('loader');

    // Display Elements
    const cityNameEl = document.getElementById('city-name');
    const temperatureEl = document.getElementById('temperature');
    const descriptionEl = document.getElementById('weather-description');
    const weatherIconEl = document.getElementById('weather-icon');

    // New Display Elements for Additional Details
    const tempMinEl = document.getElementById('temp-min');
    const tempMaxEl = document.getElementById('temp-max');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');
    const cloudinessEl = document.getElementById('cloudiness');
    const pressureEl = document.getElementById('pressure');

    // --- 2. EVENT LISTENERS ---
    locationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const location = locationInput.value.trim();
        if (location) {
            fetchWeather(location);
        }
    });

    // --- 3. CORE FUNCTIONS ---

    /**
     * Fetches weather data from the OpenWeatherMap API.
     * Uses async/await for cleaner asynchronous code.
     * @param {string} location - The city name to fetch weather for.
     */
    async function fetchWeather(location) {
        // Start loading state
        showLoading();
        hideError();
        hideWeather();

        try {
            const response = await fetch(`${apiUrl}?q=${location}&appid=${apiKey}&units=metric`);

            // Check if the HTTP response is ok
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            displayWeather(data);

        } catch (error) {
            console.error("Fetch weather error:", error);
            showError(`Could not fetch weather for "${location}". ${error.message}.`);
        } finally {
            // End loading state
            hideLoading();
        }
    }

    /**
     * Displays the fetched weather data on the page.
     * @param {object} data - The weather data object from the API.
     */
    function displayWeather(data) {
        if (!data || !data.main || !data.weather || !data.wind || !data.clouds) {
            showError("Received invalid weather data. Please try again.");
            return;
        }

        const { name, main, weather, wind, clouds } = data;

        // Current weather
        const temperature = Math.round(main.temp);
        const description = weather[0].description;
        const iconCode = weather[0].icon;

        // Additional details
        const tempMin = Math.round(main.temp_min);
        const tempMax = Math.round(main.temp_max);
        const humidity = main.humidity;
        const windSpeed = wind.speed;
        const cloudiness = clouds.all;
        const pressure = main.pressure;

        cityNameEl.textContent = name;
        temperatureEl.textContent = `${temperature}°C`;
        descriptionEl.textContent = description;
        weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIconEl.alt = description;

        // Update new elements
        tempMinEl.textContent = `${tempMin}°C`;
        tempMaxEl.textContent = `${tempMax}°C`;
        humidityEl.textContent = `${humidity}%`;
        windSpeedEl.textContent = `${windSpeed} m/s`;
        cloudinessEl.textContent = `${cloudiness}%`;
        pressureEl.textContent = `${pressure} hPa`;

        showWeather();
    }

    // --- 4. UI HELPER FUNCTIONS ---

    /** Shows the loading spinner and hides other sections. */
    function showLoading() {
        loader.classList.remove('hidden');
    }

    /** Hides the loading spinner. */
    function hideLoading() {
        loader.classList.add('hidden');
    }

    /**
     * Displays an error message to the user.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        errorMessageEl.textContent = message;
        errorContainer.classList.remove('hidden');
        hideWeather();
    }

    /** Hides the error message container. */
    function hideError() {
        if (!errorContainer.classList.contains('hidden')) {
            errorContainer.classList.add('hidden');
        }
    }

    /** Shows the weather information display. */
    function showWeather() {
        weatherDisplay.classList.remove('hidden');
    }

    /** Hides the weather information display. */
    function hideWeather() {
        if (!weatherDisplay.classList.contains('hidden')) {
            weatherDisplay.classList.add('hidden');
        }
    }
});