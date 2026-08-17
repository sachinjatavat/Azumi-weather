// src/js/components/views.js

import { renderHeroWeather } from './heroWeather.js';
import { render7DayForecast } from './forecast7Day.js';
import { renderHourly24h } from './hourly24h.js';
import { renderMetricsGrid } from './metricsGrid.js';
import { renderRadarMapContainer, initRadarMapInstance } from './radarMap.js';
import { renderWeatherNewsComponent, initWeatherNewsEvents } from './weatherNewsComponent.js';
import { getAqiStatus } from '../api/openMeteo.js';

export async function renderActiveView(state) {
  const container = document.getElementById('main-content-canvas');
  if (!container) return;

  const { activeTab, aqiData, currentCity, country } = state;

  if (activeTab === 'dashboard') {
    container.innerHTML = `
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        <div class="xl:col-span-8 fade-in-up">
          ${renderHeroWeather(state)}
        </div>
        <div class="xl:col-span-4 fade-in-up delay-100">
          ${render7DayForecast(state)}
        </div>
      </div>
      
      ${renderHourly24h(state)}
      ${renderMetricsGrid(state)}
    `;
  } else if (activeTab === 'forecast') {
    container.innerHTML = `
      <div class="space-y-6 fade-in-up">
        <div class="glass-panel rounded-3xl p-5 sm:p-7">
          <h2 class="text-xl sm:text-2xl font-bold text-on-background flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-primary-container text-2xl">calendar_month</span>
            7-Day Detailed Forecast — ${currentCity}
          </h2>
          <p class="text-xs sm:text-sm text-on-surface-variant">Extended daily temperature ranges, condition breakdown, and precipitation estimates.</p>
        </div>
        ${render7DayForecast(state)}
        ${renderHourly24h(state)}
      </div>
    `;
  } else if (activeTab === 'airquality') {
    const aqiVal = aqiData && aqiData.us_aqi !== undefined ? Math.round(aqiData.us_aqi) : 24;
    const aqiStatus = getAqiStatus(aqiVal);

    const pm2_5 = aqiData && aqiData.pm2_5 !== undefined ? aqiData.pm2_5.toFixed(1) : '8.2';
    const pm10 = aqiData && aqiData.pm10 !== undefined ? aqiData.pm10.toFixed(1) : '14.1';
    const no2 = aqiData && aqiData.nitrogen_dioxide !== undefined ? aqiData.nitrogen_dioxide.toFixed(1) : '5.6';
    const o3 = aqiData && aqiData.ozone !== undefined ? aqiData.ozone.toFixed(1) : '32.0';

    container.innerHTML = `
      <div class="space-y-6 fade-in-up">
        <div class="glass-panel rounded-3xl p-5 sm:p-7">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-on-background flex items-center gap-2">
                <span class="material-symbols-outlined text-primary-container text-2xl">air</span>
                Air Quality & Atmospheric Pollution — ${currentCity}
              </h2>
              <p class="text-xs sm:text-sm text-on-surface-variant mt-1">Live measurements from local meteorological air sensors.</p>
            </div>

            <div class="px-4 py-2 rounded-2xl bg-surface-container/60 dark:bg-white/10 border border-outline-variant/20 flex items-center gap-3">
              <span class="text-3xl font-extrabold text-primary-container">${aqiVal}</span>
              <div>
                <span class="block text-xs text-on-surface-variant font-medium">US AQI Score</span>
                <span class="text-xs font-bold ${aqiStatus.color}">${aqiStatus.label}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pollutant Breakdown Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="glass-panel rounded-3xl p-5">
            <span class="text-xs text-on-surface-variant font-bold uppercase block mb-1">PM 2.5</span>
            <div class="text-2xl font-extrabold text-on-background">${pm2_5} <span class="text-xs font-normal text-on-surface-variant">µg/m³</span></div>
            <p class="text-[11px] text-on-surface-variant mt-2">Fine inhalable particles</p>
          </div>

          <div class="glass-panel rounded-3xl p-5">
            <span class="text-xs text-on-surface-variant font-bold uppercase block mb-1">PM 10</span>
            <div class="text-2xl font-extrabold text-on-background">${pm10} <span class="text-xs font-normal text-on-surface-variant">µg/m³</span></div>
            <p class="text-[11px] text-on-surface-variant mt-2">Inhalable dust particles</p>
          </div>

          <div class="glass-panel rounded-3xl p-5">
            <span class="text-xs text-on-surface-variant font-bold uppercase block mb-1">NO2</span>
            <div class="text-2xl font-extrabold text-on-background">${no2} <span class="text-xs font-normal text-on-surface-variant">µg/m³</span></div>
            <p class="text-[11px] text-on-surface-variant mt-2">Nitrogen Dioxide</p>
          </div>

          <div class="glass-panel rounded-3xl p-5">
            <span class="text-xs text-on-surface-variant font-bold uppercase block mb-1">Ozone (O3)</span>
            <div class="text-2xl font-extrabold text-on-background">${o3} <span class="text-xs font-normal text-on-surface-variant">µg/m³</span></div>
            <p class="text-[11px] text-on-surface-variant mt-2">Ground-level Ozone</p>
          </div>
        </div>

        ${renderMetricsGrid(state)}
      </div>
    `;
  } else if (activeTab === 'radar') {
    container.innerHTML = renderRadarMapContainer(state);
    setTimeout(() => {
      initRadarMapInstance(state);
    }, 100);
  } else if (activeTab === 'news') {
    container.innerHTML = renderWeatherNewsComponent(state);
    initWeatherNewsEvents(state);
  }
}
