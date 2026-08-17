// src/js/components/metricsGrid.js

import { getAqiStatus, convertTemp } from '../api/openMeteo.js';

export function renderMetricsGrid(state) {
  const { weatherData, aqiData, unit } = state;

  const current = weatherData ? weatherData.current : {};
  const daily = weatherData ? weatherData.daily : {};

  // Air Quality
  const aqiVal = aqiData && aqiData.us_aqi !== undefined ? Math.round(aqiData.us_aqi) : 24;
  const aqiStatus = getAqiStatus(aqiVal);

  // UV Index
  const uvVal = current.uv_index !== undefined ? Math.round(current.uv_index) : (daily.uv_index_max ? Math.round(daily.uv_index_max[0]) : 2);
  let uvLabel = 'Low';
  if (uvVal >= 3) uvLabel = 'Moderate';
  if (uvVal >= 6) uvLabel = 'High';
  if (uvVal >= 8) uvLabel = 'Very High';
  if (uvVal >= 11) uvLabel = 'Extreme';

  // Wind
  const windSpeed = current.wind_speed_10m !== undefined ? Math.round(current.wind_speed_10m) : 18;
  const windDir = current.wind_direction_10m !== undefined ? current.wind_direction_10m : 45;
  const windCardinal = getWindDirectionText(windDir);

  // Humidity
  const humidity = current.relative_humidity_2m !== undefined ? Math.round(current.relative_humidity_2m) : 65;
  const dewPoint = current.dew_point_2m !== undefined ? convertTemp(current.dew_point_2m, unit) : '--';

  return `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-4 sm:mt-6 fade-in-up font-body-md">
      
      <!-- Air Quality -->
      <div class="glass-panel rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-variant/40 transition-colors">
        <div class="flex items-center justify-between mb-4 z-10">
          <span class="text-on-surface-variant text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <span class="material-symbols-outlined text-base">air</span> AQI
          </span>
          <span class="text-[10px] font-bold text-primary-container bg-primary-container/10 px-2 py-0.5 rounded-full">US Index</span>
        </div>

        <div class="flex items-end justify-between z-10 mt-auto">
          <div>
            <div class="text-2xl sm:text-4xl font-extrabold text-primary-container mb-0.5">${aqiVal}</div>
            <div class="text-on-background font-semibold text-xs sm:text-sm ${aqiStatus.color}">${aqiStatus.label}</div>
          </div>

          <!-- Gauge SVG -->
          <div class="relative w-12 h-12 sm:w-14 sm:h-14">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-outline-variant/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="100, 100" stroke-width="3.5"></path>
              <path class="text-primary-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="${Math.min(100, aqiVal / 2)}, 100" stroke-linecap="round" stroke-width="3.5"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- UV Index -->
      <div class="glass-panel rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-variant/40 transition-colors">
        <div class="flex items-center justify-between mb-4 z-10">
          <span class="text-on-surface-variant text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <span class="material-symbols-outlined text-base">sunny</span> UV Index
          </span>
        </div>

        <div class="flex items-end justify-between z-10 mt-auto">
          <div>
            <div class="text-2xl sm:text-4xl font-extrabold text-primary-container mb-0.5">${uvVal}</div>
            <div class="text-on-background font-semibold text-xs sm:text-sm">${uvLabel}</div>
          </div>

          <div class="relative w-12 h-6 sm:w-14 sm:h-7 overflow-hidden mb-1">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-outline-variant/30 absolute top-0"></div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-transparent border-t-primary-container border-r-primary-container transform -rotate-45 absolute top-0"></div>
          </div>
        </div>
      </div>

      <!-- Wind Speed -->
      <div class="glass-panel rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-variant/40 transition-colors">
        <div class="flex items-center justify-between mb-4 z-10">
          <span class="text-on-surface-variant text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <span class="material-symbols-outlined text-base">airware</span> Wind
          </span>
        </div>

        <div class="flex items-end justify-between z-10 mt-auto">
          <div>
            <div class="text-2xl sm:text-4xl font-extrabold text-on-background mb-0.5 flex items-baseline gap-1">
              ${windSpeed} <span class="text-xs sm:text-sm text-on-surface-variant font-normal">km/h</span>
            </div>
            <div class="text-on-background font-semibold text-xs sm:text-sm">${windCardinal}</div>
          </div>

          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container/60 dark:bg-white/10 flex items-center justify-center border border-outline-variant/20">
            <span class="material-symbols-outlined text-xl sm:text-2xl text-primary-container transition-transform duration-500" style="transform: rotate(${windDir}deg);">
              navigation
            </span>
          </div>
        </div>
      </div>

      <!-- Humidity -->
      <div class="glass-panel rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-variant/40 transition-colors">
        <div class="flex items-center justify-between mb-4 z-10">
          <span class="text-on-surface-variant text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <span class="material-symbols-outlined text-base">humidity_percentage</span> Humidity
          </span>
        </div>

        <div class="flex items-end justify-between z-10 mt-auto w-full">
          <div class="w-full">
            <div class="flex justify-between items-baseline mb-1">
              <div class="text-2xl sm:text-4xl font-extrabold text-on-background">
                ${humidity}<span class="text-lg text-on-surface-variant font-normal">%</span>
              </div>
              <span class="material-symbols-outlined text-primary-container text-xl sm:text-2xl">water_drop</span>
            </div>
            <div class="text-on-surface-variant text-[11px] sm:text-xs font-medium mb-2">Dew point ${dewPoint}°${unit}</div>
            <div class="w-full h-1.5 bg-outline-variant/30 rounded-full overflow-hidden">
              <div class="h-full bg-primary-container rounded-full" style="width: ${humidity}%;"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

function getWindDirectionText(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}
