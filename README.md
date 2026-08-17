# ⛅ Asumi — Real-Time Global Weather & Live Radar Web Application

A modern, high-performance, real-time weather web application built with **Vanilla JavaScript (ES Modules)**, **Tailwind CSS**, **Open-Meteo Weather APIs**, **Leaflet.js** live radar maps, and real-time worldwide weather news.

---

## 🌐 Quick Access & Local Development

- 🏠 **Local Development URL**: `http://localhost:3000`
- 📱 **Mobile Network URL**: `http://192.168.0.190:3000` (Access directly from your mobile phone on the same Wi-Fi network)

---

## ✨ Features

- 🌡️ **Real-Time Live Weather Data**: Temperature, "feels like" apparent temperature, high/low, wind speed & direction, pressure, humidity, dew point, cloud cover, and UV index.
- 🕒 **Live Local City Clock**: Real-time digital clock displaying the exact local time and date for any searched city worldwide based on its official timezone.
- 📱 **Mobile Touch-Optimized Search**: Instant city search with debouncing, country flag emojis, and `touchstart`/`mousedown` event handling engineered specifically for seamless selection on Android soft keyboards and touchscreens.
- 📍 **One-Click Geolocation**: Detect user's current location via Browser Geolocation API (`navigator.geolocation`).
- 📌 **Persistent Location State**: Searched location persists seamlessly across all sub-views (Dashboard, 7-Day Forecast, Air Quality, Live Radar, Weather News) and saves to `localStorage`.
- 🗺️ **Interactive Live Radar Map**: Powered by **Leaflet.js** & **RainViewer API** with live global precipitation radar overlay, map controls, and high-contrast weather marker pills.
- 📰 **Strict Live World Weather News**: Real-time global weather news feed using live RSS streams (Google News, UN Weather Agency, Severe Weather Europe, WMO) filtered strictly for meteorological events (hurricanes, blizzards, floods, heatwaves, tornadoes, temp records) with an interactive story modal reader.
- 🌓 **Light & Dark Theme Switcher**: Toggle between Light Mode and Dark Mode ("Obsidian Night" aesthetic) with automatic Leaflet map tile switching (CartoDB Voyager vs CartoDB Dark Matter).
- 🌡️ **Unit Converter**: Toggle between **Celsius (°C)** and **Fahrenheit (°F)** with instant reactive updates across all widgets.
- 📐 **Mobile Responsive Scaling**: Ultra-responsive layout scaling on mobile screens without text overflowing, featuring a responsive bottom navigation bar.
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
  - [Live Weather RSS Stream & Open News APIs] (Worldwide weather & climate news feed)
- **Mapping Engine**: [Leaflet.js](https://leafletjs.com/) with CartoDB Voyager & Dark Matter tiles
- **Bundler & Server**: [Vite](https://vitejs.dev/)

---

## 📂 Project Architecture

```
Azumi-weather/
├── index.html                  # HTML entry point with clean navigation & head config
├── package.json                # Vite dependencies & build scripts
├── vite.config.js              # Vite server config (host & allowedHosts enabled)
├── DESIGN.md                   # Design system tokens & aesthetic guidelines
├── README.md                   # Updated documentation & setup guide
└── src/
    ├── css/
    │   └── style.css           # Custom glassmorphism, responsive font scaling & dark mode
    ├── js/
    │   ├── api/
    │   │   ├── openMeteo.js    # Weather & AQI API with 5-minute TTL caching
    │   │   ├── geocoding.js    # City autocomplete & geolocation service
    │   │   └── weatherNews.js  # Strict live world weather news API engine
    │   ├── components/
    │   │   ├── header.js       # Mobile touch search, theme & unit toggles
    │   │   ├── heroWeather.js  # Weather card & live city clock
    │   │   ├── forecast7Day.js # 7-day daily forecast widget
    │   │   ├── hourly24h.js    # 24-hour horizontal forecast scroller
    │   │   ├── metricsGrid.js  # AQI SVG gauge, UV Index, Wind compass, Humidity grid
    │   │   ├── radarMap.js     # Leaflet interactive radar map
    │   │   ├── weatherNewsComponent.js # World weather news cards grid & story modal reader
    │   │   └── views.js        # Tab navigation view switcher
    │   ├── effects/
    │   │   └── weatherCanvas.js# 60fps HTML5 Canvas particle engine
    │   ├── state.js            # Global reactive state manager
    │   └── main.js             # Application bootstrapper
```

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License

Distributed under the MIT License.
