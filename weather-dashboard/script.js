// OpenWeatherMap API Configuration
// Note: You can get a free API key from https://openweathermap.org/api
const API_KEY = 'f3cde622397afd26dabf634e3ea58e81'; // Demo key - replace with your own
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// State Management
const state = {
    currentWeather: null,
    forecast: null,
    hourlyForecast: null,
    airQuality: null,
    isCelsius: true,
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    favorites: JSON.parse(localStorage.getItem('weatherFavorites') || '[]'),
    currentCity: localStorage.getItem('lastCity') || 'London',
    searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    setupEventListeners();
    fetchWeatherByCity(state.currentCity);
    displayFavorites();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search form
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Location button
    document.getElementById('locationBtn').addEventListener('click', getGeolocation);
    
    // Search input for suggestions
    document.getElementById('searchInput').addEventListener('input', handleSearchInput);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-center')) {
            document.getElementById('suggestions').innerHTML = '';
        }
    });
}

// Handle Search
function handleSearch(e) {
    e.preventDefault();
    const city = document.getElementById('searchInput').value.trim();
    if (city) {
        fetchWeatherByCity(city);
        addToSearchHistory(city);
        document.getElementById('searchInput').value = '';
        document.getElementById('suggestions').innerHTML = '';
    }
}

// Handle Search Input for Suggestions
async function handleSearchInput(e) {
    const input = e.target.value.trim();
    if (input.length < 2) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }

    try {
        const response = await fetch(
            `${GEO_URL}/direct?q=${input}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        
        const suggestions = document.getElementById('suggestions');
        suggestions.innerHTML = '';
        
        data.forEach(location => {
            const li = document.createElement('li');
            li.textContent = `${location.name}, ${location.country}`;
            li.addEventListener('click', () => {
                document.getElementById('searchInput').value = location.name;
                fetchWeatherByCoords(location.lat, location.lon, location.name);
                suggestions.innerHTML = '';
            });
            suggestions.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Fetch Weather by City Name
async function fetchWeatherByCity(city) {
    showLoading(true);
    hideError();
    
    try {
        // Get coordinates from city name
        const geoResponse = await fetch(
            `${GEO_URL}/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        
        if (!geoResponse.ok) {
            throw new Error('City not found');
        }
        
        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
            throw new Error('City not found');
        }
        
        const { lat, lon, name, country } = geoData[0];
        state.currentCity = name;
        localStorage.setItem('lastCity', name);
        
        await fetchWeatherByCoords(lat, lon, name);
    } catch (error) {
        showError(`Error: ${error.message}`);
        showLoading(false);
    }
}

// Fetch Weather by Coordinates
async function fetchWeatherByCoords(lat, lon, cityName) {
    showLoading(true);
    hideError();
    
    try {
        // Fetch current weather
        const currentResponse = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const currentData = await currentResponse.json();
        
        // Fetch forecast
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();
        
        // Fetch air quality (requires different endpoint)
        const aqiResponse = await fetch(
            `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const aqiData = await aqiResponse.json();
        
        // Fetch UV Index
        const uvResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const uvData = await uvResponse.json();
        
        // Update state
        state.currentWeather = currentData;
        state.currentWeather.uvi = uvData.value;
        state.currentWeather.cityName = cityName;
        state.forecast = forecastData;
        state.airQuality = aqiData;
        
        // Render data
        renderCurrentWeather();
        renderHourlyForecast();
        renderForecast();
        renderAirQuality();
        
        showLoading(false);
        displaySections();
    } catch (error) {
        showError(`Error fetching weather data: ${error.message}`);
        showLoading(false);
    }
}

// Get Geolocation
function getGeolocation() {
    if (navigator.geolocation) {
        showLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude, 'Your Location');
            },
            (error) => {
                showError('Error getting your location. Please enable location services.');
                showLoading(false);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

// Render Current Weather
function renderCurrentWeather() {
    const weather = state.currentWeather;
    const isCelsius = state.isCelsius;
    
    const temp = isCelsius ? Math.round(weather.main.temp) : Math.round((weather.main.temp * 9/5) + 32);
    const feelsLike = isCelsius ? Math.round(weather.main.feels_like) : Math.round((weather.main.feels_like * 9/5) + 32);
    const tempUnit = isCelsius ? '°C' : '°F';
    const windUnit = isCelsius ? 'm/s' : 'mph';
    const windSpeed = isCelsius ? weather.wind.speed : (weather.wind.speed * 2.237).toFixed(1);
    const visibility = (weather.visibility / 1000).toFixed(1);
    
    document.getElementById('cityName').textContent = weather.cityName || weather.name;
    document.getElementById('countryName').textContent = `${weather.sys.country}`;
    document.getElementById('lastUpdated').textContent = `Last updated: ${new Date(weather.dt * 1000).toLocaleString()}`;
    document.getElementById('temperature').textContent = temp;
    document.getElementById('tempUnit').textContent = tempUnit;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;
    document.getElementById('description').textContent = capitalize(weather.weather[0].description);
    document.getElementById('feelsLike').textContent = `Feels like ${feelsLike}${tempUnit}`;
    document.getElementById('humidity').textContent = `${weather.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${windSpeed} ${windUnit}`;
    document.getElementById('pressure').textContent = `${weather.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${visibility} km`;
    document.getElementById('clouds').textContent = `${weather.clouds.all}%`;
    document.getElementById('uvIndex').textContent = getUVIndexStatus(weather.uvi);
    
    // Add to favorites button styling
    updateFavoriteButton();
}

// Render Hourly Forecast
function renderHourlyForecast() {
    const forecast = state.forecast;
    const hourlyContainer = document.getElementById('hourlyContainer');
    hourlyContainer.innerHTML = '';
    
    // Get next 24 hours (8 entries, 3-hour intervals)
    const next24Hours = forecast.list.slice(0, 8);
    
    next24Hours.forEach(hour => {
        const date = new Date(hour.dt * 1000);
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temp = state.isCelsius ? Math.round(hour.main.temp) : Math.round((hour.main.temp * 9/5) + 32);
        const tempUnit = state.isCelsius ? '°C' : '°F';
        
        const hourCard = document.createElement('div');
        hourCard.className = 'hour-card';
        hourCard.innerHTML = `
            <p class="hour-time">${time}</p>
            <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="Weather">
            <p class="hour-temp">${temp}${tempUnit}</p>
            <p class="hour-desc">${capitalize(hour.weather[0].main)}</p>
        `;
        hourlyContainer.appendChild(hourCard);
    });
}

// Render 7-Day Forecast
function renderForecast() {
    const forecast = state.forecast;
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';
    
    // Group by day
    const dailyData = {};
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });
    
    // Get one entry per day (noon time)
    let dayCount = 0;
    Object.entries(dailyData).forEach(([date, items]) => {
        if (dayCount >= 7) return;
        
        // Find the entry closest to noon
        const noonEntry = items.reduce((closest, item) => {
            const hour = new Date(item.dt * 1000).getHours();
            const closestHour = new Date(closest.dt * 1000).getHours();
            return Math.abs(hour - 12) < Math.abs(closestHour - 12) ? item : closest;
        });
        
        const minTemp = Math.min(...items.map(i => i.main.temp_min));
        const maxTemp = Math.max(...items.map(i => i.main.temp_max));
        
        const minTempDisplay = state.isCelsius ? Math.round(minTemp) : Math.round((minTemp * 9/5) + 32);
        const maxTempDisplay = state.isCelsius ? Math.round(maxTemp) : Math.round((maxTemp * 9/5) + 32);
        const tempUnit = state.isCelsius ? '°C' : '°F';
        
        const forecastDate = new Date(noonEntry.dt * 1000);
        const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
        const dayDate = forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h3>${dayName}</h3>
            <p class="forecast-date">${dayDate}</p>
            <img src="https://openweathermap.org/img/wn/${noonEntry.weather[0].icon}@2x.png" alt="Weather">
            <p class="forecast-desc">${capitalize(noonEntry.weather[0].main)}</p>
            <div class="forecast-temps">
                <span class="max">${maxTempDisplay}${tempUnit}</span>
                <span class="min">${minTempDisplay}${tempUnit}</span>
            </div>
            <div class="forecast-details">
                <p><i class="fas fa-water"></i> ${noonEntry.main.humidity}%</p>
                <p><i class="fas fa-wind"></i> ${noonEntry.wind.speed.toFixed(1)} m/s</p>
            </div>
        `;
        forecastGrid.appendChild(card);
        dayCount++;
    });
}

// Render Air Quality
function renderAirQuality() {
    const aqi = state.airQuality;
    if (!aqi || !aqi.list) return;
    
    const main = aqi.list[0].main;
    const components = aqi.list[0].components;
    
    const aqiValue = main.aqi;
    const aqiStatus = getAQIStatus(aqiValue);
    
    document.getElementById('aqiValue').textContent = aqiStatus.level;
    document.getElementById('aqiStatus').textContent = aqiStatus.description;
    document.getElementById('aqiValue').style.background = aqiStatus.color;
    
    const aqiDetails = document.getElementById('aqiDetails');
    aqiDetails.innerHTML = `
        <div class="pollutant">
            <span>PM2.5</span>
            <p>${components.pm2_5?.toFixed(1) || 'N/A'} μg/m³</p>
        </div>
        <div class="pollutant">
            <span>PM10</span>
            <p>${components.pm10?.toFixed(1) || 'N/A'} μg/m³</p>
        </div>
        <div class="pollutant">
            <span>O₃</span>
            <p>${components.o3?.toFixed(1) || 'N/A'} μg/m³</p>
        </div>
        <div class="pollutant">
            <span>NO₂</span>
            <p>${components.no2?.toFixed(1) || 'N/A'} μg/m³</p>
        </div>
        <div class="pollutant">
            <span>SO₂</span>
            <p>${components.so2?.toFixed(1) || 'N/A'} μg/m³</p>
        </div>
        <div class="pollutant">
            <span>CO</span>
            <p>${components.co?.toFixed(0) || 'N/A'} μg/m³</p>
        </div>
    `;
}

// Utility Functions
function getAQIStatus(aqi) {
    const statuses = {
        1: { level: 'GOOD', description: 'Good air quality', color: '#4CAF50' },
        2: { level: 'FAIR', description: 'Fair air quality', color: '#8BC34A' },
        3: { level: 'MODERATE', description: 'Moderate air quality', color: '#FFC107' },
        4: { level: 'POOR', description: 'Poor air quality', color: '#FF9800' },
        5: { level: 'VERY POOR', description: 'Very poor air quality', color: '#F44336' }
    };
    return statuses[aqi] || statuses[1];
}

function getUVIndexStatus(uvi) {
    if (uvi < 3) return 'Low';
    if (uvi < 6) return 'Moderate';
    if (uvi < 8) return 'High';
    if (uvi < 11) return 'Very High';
    return 'Extreme';
}

function capitalize(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function displaySections() {
    document.getElementById('currentWeather').style.display = 'block';
    document.getElementById('hourlyForecast').style.display = 'block';
    document.getElementById('forecastSection').style.display = 'block';
    document.getElementById('airQuality').style.display = 'block';
}

// Theme Toggle
function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    localStorage.setItem('darkMode', state.isDarkMode);
    applyTheme();
}

function applyTheme() {
    const btn = document.getElementById('themeToggle');
    if (state.isDarkMode) {
        document.body.classList.add('dark-mode');
        btn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        btn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Temperature Unit Toggle
function toggleTemperatureUnit() {
    state.isCelsius = !state.isCelsius;
    if (state.currentWeather) {
        renderCurrentWeather();
        renderHourlyForecast();
        renderForecast();
    }
}

// Favorites Management
function addToFavorites() {
    if (!state.currentWeather) return;
    
    const favorite = {
        name: state.currentWeather.cityName || state.currentWeather.name,
        country: state.currentWeather.sys.country,
        lat: state.currentWeather.coord.lat,
        lon: state.currentWeather.coord.lon
    };
    
    const exists = state.favorites.some(f => f.lat === favorite.lat && f.lon === favorite.lon);
    if (!exists) {
        state.favorites.push(favorite);
        localStorage.setItem('weatherFavorites', JSON.stringify(state.favorites));
        updateFavoriteButton();
        showNotification(`${favorite.name} added to favorites!`);
    }
}

function removeFromFavorites(lat, lon) {
    state.favorites = state.favorites.filter(f => !(f.lat === lat && f.lon === lon));
    localStorage.setItem('weatherFavorites', JSON.stringify(state.favorites));
    displayFavorites();
    updateFavoriteButton();
}

function updateFavoriteButton() {
    if (!state.currentWeather) return;
    
    const isFavorite = state.favorites.some(f => 
        f.lat === state.currentWeather.coord.lat && f.lon === state.currentWeather.coord.lon
    );
    
    const btn = document.querySelector('.favorite-btn');
    if (btn) {
        btn.classList.toggle('active', isFavorite);
    }
}

function displayFavorites() {
    if (state.favorites.length === 0) {
        document.getElementById('favoritesSection').style.display = 'none';
        return;
    }
    
    document.getElementById('favoritesSection').style.display = 'block';
    const favoritesGrid = document.getElementById('favoritesGrid');
    favoritesGrid.innerHTML = '';
    
    state.favorites.forEach(fav => {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        card.innerHTML = `
            <h3>${fav.name}, ${fav.country}</h3>
            <button class="remove-btn" onclick="removeFromFavorites(${fav.lat}, ${fav.lon})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-btn')) {
                fetchWeatherByCoords(fav.lat, fav.lon, fav.name);
            }
        });
        favoritesGrid.appendChild(card);
    });
}

// Search History
function addToSearchHistory(city) {
    if (!state.searchHistory.includes(city)) {
        state.searchHistory.unshift(city);
        if (state.searchHistory.length > 10) {
            state.searchHistory.pop();
        }
        localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory));
    }
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Default city on load
window.addEventListener('load', () => {
    if (!state.currentWeather) {
        fetchWeatherByCity('London');
    }
});
