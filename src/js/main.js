// src/js/main.js

import { stateManager } from './state.js';
import { fetchWeatherData, fetchAirQualityData } from './api/openMeteo.js';
import { fetchLiveWeatherNews } from './api/weatherNews.js';
import { initHeader } from './components/header.js';
import { renderActiveView } from './components/views.js';
import { weatherCanvasEngine } from './effects/weatherCanvas.js';

let isFetchingData = false;

async function loadDataForLocation(lat, lon, timezone = 'auto') {
  if (isFetchingData) return;
  isFetchingData = true;

  try {
    const currentState = stateManager.getState();
    const weather = await fetchWeatherData(lat, lon, timezone);
    const [aqi, news] = await Promise.all([
      fetchAirQualityData(lat, lon),
      fetchLiveWeatherNews(currentState.currentCity, weather)
    ]);

    stateManager.setState({
      weatherData: weather,
      aqiData: aqi,
      newsData: news,
      loading: false
    });

    if (weather && weather.current) {
      weatherCanvasEngine.setWeather(weather.current.weather_code, weather.current.is_day);
    }
  } catch (err) {
    console.error('Failed to load location data:', err);
    stateManager.setState({ loading: false, error: err.message });
  } finally {
    isFetchingData = false;
  }
}

async function initApp() {
  // Initialize Header component listeners
  initHeader();

  // Initialize Canvas Particle Engine
  weatherCanvasEngine.init('weather-canvas');

  const initialState = stateManager.getState();
  document.documentElement.className = initialState.theme;

  // Render Initial View
  renderActiveView(initialState);

  // Load Initial Weather Data
  await loadDataForLocation(initialState.lat, initialState.lon, initialState.timezone);

  // Subscribe to state updates
  stateManager.subscribe((state, changedKeys) => {
    // If location changed, re-fetch weather data
    if (changedKeys.includes('lat') || changedKeys.includes('lon')) {
      loadDataForLocation(state.lat, state.lon, state.timezone);
    }

    // Re-render active view on relevant state updates
    if (
      changedKeys.includes('weatherData') ||
      changedKeys.includes('activeTab') ||
      changedKeys.includes('unit') ||
      changedKeys.includes('theme') ||
      changedKeys.includes('newsData')
    ) {
      renderActiveView(state);
    }

    if (changedKeys.includes('weatherData') && state.weatherData && state.weatherData.current) {
      weatherCanvasEngine.setWeather(state.weatherData.current.weather_code, state.weatherData.current.is_day);
    }
  });
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
