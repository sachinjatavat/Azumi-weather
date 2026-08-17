// src/js/state.js

const FAVORITES_KEY = 'asumi_weather_favorites';
const UNIT_KEY = 'asumi_weather_unit';
const THEME_KEY = 'asumi_weather_theme';

class AppState {
  constructor() {
    this.state = {
      currentCity: 'Reykjavík',
      country: 'Iceland',
      countryCode: 'IS',
      lat: 64.1466,
      lon: -21.9426,
      timezone: 'Atlantic/Reykjavik',
      weatherData: null,
      hourlyData: null,
      dailyData: null,
      aqiData: null,
      newsData: null,
      loading: false,
      error: null,
      unit: localStorage.getItem(UNIT_KEY) || 'C',
      theme: localStorage.getItem(THEME_KEY) || 'light',
      activeTab: 'dashboard',
      favorites: JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    };

    this.subscribers = [];
  }

  getState() {
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify(changedKeys = []) {
    this.subscribers.forEach(callback => callback(this.state, changedKeys));
  }

  setState(newState) {
    const changedKeys = Object.keys(newState);
    this.state = { ...this.state, ...newState };

    if (changedKeys.includes('unit')) {
      localStorage.setItem(UNIT_KEY, this.state.unit);
    }
    if (changedKeys.includes('theme')) {
      localStorage.setItem(THEME_KEY, this.state.theme);
      document.documentElement.className = this.state.theme;
    }
    if (changedKeys.includes('favorites')) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.state.favorites));
    }

    this.notify(changedKeys);
  }

  toggleUnit() {
    const newUnit = this.state.unit === 'C' ? 'F' : 'C';
    this.setState({ unit: newUnit });
  }

  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setState({ theme: newTheme });
  }

  toggleFavorite() {
    const currentLoc = {
      city: this.state.currentCity,
      country: this.state.country,
      lat: this.state.lat,
      lon: this.state.lon
    };

    const isFav = this.state.favorites.some(f => f.city === currentLoc.city && f.country === currentLoc.country);
    let updatedFavorites;

    if (isFav) {
      updatedFavorites = this.state.favorites.filter(f => !(f.city === currentLoc.city && f.country === currentLoc.country));
    } else {
      updatedFavorites = [...this.state.favorites, currentLoc];
    }

    this.setState({ favorites: updatedFavorites });
  }

  isCurrentFavorite() {
    return this.state.favorites.some(
      f => f.city === this.state.currentCity && f.country === this.state.country
    );
  }

  setActiveTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  setLocation(cityData) {
    this.setState({
      currentCity: cityData.name || cityData.city,
      country: cityData.country || '',
      countryCode: cityData.country_code || cityData.countryCode || '',
      lat: cityData.latitude || cityData.lat,
      lon: cityData.longitude || cityData.lon,
      timezone: cityData.timezone || 'auto'
    });
  }
}

export const stateManager = new AppState();
