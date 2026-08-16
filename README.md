# ⛅ Asumi — Real-Time Global Weather & Live Radar Web Application

A modern, high-performance, real-time weather web application built with **Vanilla JavaScript (ES Modules)**, **Tailwind CSS**, **Open-Meteo Weather APIs**, and **Leaflet.js** live radar maps.

---

## 🌐 Official Live Cloud Deployment

The application is deployed 24/7 on global CDN edge servers:
- 🔗 **Official Live Web URL**: [https://asumi-global-weather.surge.sh](https://asumi-global-weather.surge.sh)
- 🏠 **Local Development URL**: `http://localhost:3000`

---

## ✨ Features

- 🌡️ **Real-Time Live Weather Data**: Temperature, "feels like" apparent temperature, high/low, wind speed & direction, pressure, humidity, dew point, cloud cover, and UV index.
- 🕒 **Live Local City Clock**: Real-time digital clock displaying the exact local time and date for any searched city worldwide based on its official timezone.
- 🔍 **City Search & Autocomplete**: Instant city search with debouncing, country flag emojis, population metadata, and keyboard `Enter` selection without page reloads.
- 📍 **One-Click Geolocation**: Detect user's current location via Browser Geolocation API (`navigator.geolocation`).
- 📌 **Persistent Searched Location**: Location data persists seamlessly across all sub-views (Dashboard, 7-Day Forecast, Air Quality, Live Radar, Weather News) and saves to `localStorage`.
- 🗺️ **Interactive Live Radar Map**: Powered by **Leaflet.js** & **RainViewer API** with live global precipitation radar overlay, map controls, and high-contrast solid weather marker pills.
- 📰 **Weather News & Alerts**: Breaking weather news ticker, climate bulletins, severe storm advisories, and an interactive full story modal reader.
- 🌓 **Light & Dark Theme Switcher**: Seamlessly toggle between Light Mode ("Vibrant Joy" aesthetic) and Dark Mode ("Obsidian Night" aesthetic), with automatic Leaflet map tile switching (CartoDB Voyager vs CartoDB Dark Matter).
- 🌡️ **Unit Converter**: Toggle between **Celsius (°C)** and **Fahrenheit (°F)** with instant reactive updates across all widgets.
- 🎨 **Dynamic Weather Particle Effects**: 60fps HTML5 Canvas particle engine rendering custom weather animations (falling snow, rain droplets, twinkling stars, and sun glints) with tab visibility throttling for low CPU usage.
- ⚡ **5-Minute API Caching Layer**: In-memory caching layer prevents redundant network requests for instant tab switching.

---

## 🛠️ Technology Stack

- **Frontend Core**: HTML5, Vanilla JavaScript (ES6 Modules)
- **Styling**: Tailwind CSS (Form & Container plugins), Glassmorphism, Material Symbols Icons, DM Sans typography
- **APIs**:
  - [Open-Meteo Weather API](https://open-meteo.com/) (Current weather, 24h hourly forecast, 7-day daily forecast)
  - [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) (US AQI & PM2.5 / PM10 / NO2 / O3)
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (City search autocomplete)
  - [RainViewer Weather Radar API](https://www.rainviewer.com/api.html) (Live global radar overlay)
- **Mapping Engine**: [Leaflet.js](https://leafletjs.com/) with CartoDB Voyager & Dark Matter tiles
- **Deployment**: Surge.sh Global Edge CDN (`https://asumi-global-weather.surge.sh`)
- **Bundler & Server**: [Vite](https://vitejs.dev/)

---

## 📂 Project Architecture

```
Azumi weather/
├── index.html                  # HTML entry point with meta tags & Tailwind config
├── package.json                # Vite dependencies & build scripts
├── vite.config.js              # Vite server & production build config
├── DESIGN.md                   # Design system tokens & aesthetic guidelines
├── README.md                   # Documentation & setup guide
└── src/
    ├── css/
    │   └── style.css           # Glassmorphism & custom utility classes
    ├── js/
    │   ├── api/
    │   │   ├── openMeteo.js    # Weather & AQI API with 5-minute TTL caching
    │   │   ├── geocoding.js    # City autocomplete & geolocation service
    │   │   └── weatherNews.js  # Weather news bulletins & alerts API
    │   ├── components/
    │   │   ├── header.js       # Search bar, location button, unit & theme toggle
    │   │   ├── heroWeather.js  # Main weather card & live city clock
    │   │   ├── forecast7Day.js # 7-day daily forecast widget
    │   │   ├── hourly24h.js    # 24-hour horizontal forecast scroller
    │   │   ├── metricsGrid.js  # AQI, UV Index, Wind compass, Humidity grid
    │   │   ├── favorites.js    # Saved favorite cities bar
    │   │   ├── radarMap.js     # Leaflet interactive radar map
    │   │   ├── weatherNews.js  # News ticker & story modal reader
    │   │   └── views.js        # Tab navigation renderer
    │   ├── effects/
    │   │   └── weatherCanvas.js# 60fps HTML5 Canvas particle engine
    │   ├── state.js            # Global reactive state manager
    │   └── main.js             # Application bootstrapper
```

---

## 📄 License

Distributed under the MIT License.
