// src/js/components/radarMap.js

import { convertTemp } from '../api/openMeteo.js';

let leafletMap = null;
let radarTileLayer = null;
let currentMarker = null;

export function renderRadarMapContainer(state) {
  const { currentCity, country } = state;

  return `
    <div class="glass-panel rounded-3xl p-4 sm:p-6 fade-in-up">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-base sm:text-lg font-bold text-on-background flex items-center gap-2">
            <span class="material-symbols-outlined text-primary-container text-xl">radar</span>
            Live Global Precipitation Radar
          </h3>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Real-time RainViewer radar overlay centered on ${currentCity}${country ? `, ${country}` : ''}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button type="button" id="recenter-map-btn" class="px-3 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container font-bold text-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">my_location</span>
            Recenter
          </button>
        </div>
      </div>

      <!-- Map Element Canvas -->
      <div id="leaflet-radar-map" class="w-full h-[360px] sm:h-[480px] lg:h-[560px] rounded-2xl overflow-hidden shadow-inner border border-outline-variant/20 relative z-10"></div>
    </div>
  `;
}

export async function initRadarMapInstance(state) {
  const mapEl = document.getElementById('leaflet-radar-map');
  if (!mapEl || typeof window.L === 'undefined') return;

  const { lat, lon, currentCity, theme, weatherData, unit } = state;

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  // Base map tile selection
  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

  leafletMap = window.L.map(mapEl, {
    center: [lat, lon],
    zoom: 7,
    zoomControl: true
  });

  window.L.tileLayer(tileUrl, {
    attribution: tileAttr,
    maxZoom: 18
  }).addTo(leafletMap);

  // Custom marker icon
  const currentTemp = weatherData && weatherData.current ? convertTemp(weatherData.current.temperature_2m, unit) : '--';
  const customIcon = window.L.divIcon({
    className: 'custom-radar-marker',
    html: `
      <div class="bg-primary-container text-on-primary-container font-bold text-xs px-2.5 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
        ${currentCity} ${currentTemp}°
      </div>
    `,
    iconSize: [120, 36],
    iconAnchor: [60, 18]
  });

  currentMarker = window.L.marker([lat, lon], { icon: customIcon }).addTo(leafletMap);
  currentMarker.bindPopup(`<b>${currentCity}</b><br/>Latitude: ${lat.toFixed(4)}, Longitude: ${lon.toFixed(4)}`);

  // Load RainViewer Radar Overlay
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
    if (res.ok) {
      const data = await res.json();
      if (data.radar && data.radar.past && data.radar.past.length > 0) {
        const latestFrame = data.radar.past[data.radar.past.length - 1];
        const radarTileUrl = `https://tilecache.rainviewer.com/v2/radar/${latestFrame.time}/256/{z}/{x}/{y}/2/1_1.png`;
        
        radarTileLayer = window.L.tileLayer(radarTileUrl, {
          opacity: 0.75,
          maxZoom: 18
        }).addTo(leafletMap);
      }
    }
  } catch (err) {
    console.warn('RainViewer API error:', err);
  }

  // Recenter button listener
  const recenterBtn = document.getElementById('recenter-map-btn');
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      if (leafletMap) {
        leafletMap.setView([lat, lon], 8, { animate: true });
      }
    });
  }
}
