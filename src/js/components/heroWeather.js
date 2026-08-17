// src/js/components/heroWeather.js

import { getWeatherConditionInfo, convertTemp } from '../api/openMeteo.js';

let clockInterval = null;

export function renderHeroWeather(state) {
  const { currentCity, country, weatherData, unit, timezone } = state;

  if (!weatherData || !weatherData.current) {
    return `
      <div class="glass-panel rounded-3xl p-6 sm:p-8 flex items-center justify-center min-h-[300px]">
        <div class="flex items-center space-x-3 text-on-surface-variant animate-pulse">
          <span class="material-symbols-outlined text-3xl">cloud_sync</span>
          <span class="text-base font-medium">Fetching real-time weather...</span>
        </div>
      </div>
    `;
  }

  const current = weatherData.current;
  const daily = weatherData.daily;
  const condition = getWeatherConditionInfo(current.weather_code, current.is_day);

  const tempDisplay = convertTemp(current.temperature_2m, unit);
  const feelsLikeDisplay = convertTemp(current.apparent_temperature, unit);

  const maxTemp = daily && daily.temperature_2m_max ? convertTemp(daily.temperature_2m_max[0], unit) : '--';
  const minTemp = daily && daily.temperature_2m_min ? convertTemp(daily.temperature_2m_min[0], unit) : '--';

  // Start live clock ticking for city's local time
  startLiveClock(timezone, weatherData.utcOffsetSeconds);

  return `
    <div class="glass-panel rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between min-h-[360px] sm:min-h-[420px] relative overflow-hidden group shadow-xl transition-all">
      <!-- Ambient Glow Effect -->
      <div class="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-primary-container/15 rounded-full blur-[90px] pointer-events-none transition-colors duration-1000"></div>

      <!-- Top Header Row -->
      <div class="flex flex-wrap justify-between items-start z-10 relative gap-3">
        <div>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-background tracking-tight leading-tight">
            ${currentCity}${country ? `, ${country}` : ''}
          </h2>
          <p class="font-body-md text-xs sm:text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
            <span class="material-symbols-outlined text-sm sm:text-base">schedule</span>
            <span id="city-local-clock">--:-- --</span>
          </p>
        </div>

        <div class="bg-surface-container/70 dark:bg-white/10 backdrop-blur-md border border-outline-variant/20 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          <span class="text-[10px] sm:text-xs text-on-surface font-bold tracking-wider uppercase">LIVE WEATHER</span>
        </div>
      </div>

      <!-- Main Temperature & Condition Row -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between z-10 relative my-6 sm:my-8 gap-4">
        <div class="flex items-center gap-4 sm:gap-6">
          <div class="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-primary-container tracking-tighter drop-shadow-sm leading-none">
            ${tempDisplay}°<span class="text-2xl sm:text-4xl font-medium">${unit}</span>
          </div>

          <div class="flex flex-col justify-center">
            <span class="material-symbols-outlined text-4xl sm:text-6xl text-primary-container drop-shadow-sm" style='font-variation-settings: "FILL" 1;'>
              ${condition.icon}
            </span>
            <span class="text-lg sm:text-2xl font-bold text-on-background mt-1 leading-snug">
              ${condition.text}
            </span>
          </div>
        </div>

        <!-- Quick Stats Cards -->
        <div class="flex flex-row sm:flex-col gap-2 sm:gap-3 text-right">
          <div class="flex-1 bg-surface-container/50 dark:bg-white/5 border border-outline-variant/20 backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl flex items-center justify-between gap-3 sm:gap-6">
            <span class="text-on-surface-variant text-xs sm:text-sm font-medium">Feels Like</span>
            <span class="text-on-background text-sm sm:text-base font-bold">${feelsLikeDisplay}°${unit}</span>
          </div>
          <div class="flex-1 bg-surface-container/50 dark:bg-white/5 border border-outline-variant/20 backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl flex items-center justify-between gap-3 sm:gap-6">
            <span class="text-on-surface-variant text-xs sm:text-sm font-medium">High / Low</span>
            <span class="text-on-background text-sm sm:text-base font-bold">${maxTemp}° / ${minTemp}°</span>
          </div>
        </div>
      </div>

      <!-- Daily Outlook Footer -->
      <div class="mt-auto pt-4 border-t border-outline-variant/20 z-10 relative">
        <p class="text-on-surface-variant text-xs sm:text-sm leading-relaxed flex items-start gap-2">
          <span class="material-symbols-outlined text-primary-container text-base sm:text-lg flex-shrink-0 mt-0.5">info</span>
          <span>
            <strong class="text-on-background font-semibold">Today's Outlook:</strong> 
            Currently ${condition.text.toLowerCase()} with wind at ${Math.round(current.wind_speed_10m)} km/h. High of ${maxTemp}°${unit} and low of ${minTemp}°${unit}.
          </span>
        </p>
      </div>
    </div>
  `;
}

function startLiveClock(timeZone, utcOffsetSeconds) {
  if (clockInterval) clearInterval(clockInterval);

  const updateClock = () => {
    const clockEl = document.getElementById('city-local-clock');
    if (!clockEl) return;

    try {
      const now = new Date();
      let timeString = '';

      if (timeZone && timeZone !== 'auto') {
        timeString = new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(now);
      } else if (utcOffsetSeconds !== undefined) {
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cityTime = new Date(utc + (1000 * utcOffsetSeconds));
        timeString = cityTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      } else {
        timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      }

      clockEl.textContent = `${timeString} • Live Local Time`;
    } catch (e) {
      const now = new Date();
      clockEl.textContent = `${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • Local Time`;
    }
  };

  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}
