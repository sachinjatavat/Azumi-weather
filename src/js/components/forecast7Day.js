// src/js/components/forecast7Day.js

import { getWeatherConditionInfo, convertTemp } from '../api/openMeteo.js';

export function render7DayForecast(state) {
  const { weatherData, unit } = state;

  if (!weatherData || !weatherData.daily) {
    return `
      <div class="glass-panel rounded-3xl p-6 flex items-center justify-center min-h-[300px]">
        <div class="text-on-surface-variant animate-pulse text-sm">Loading 7-day forecast...</div>
      </div>
    `;
  }

  const daily = weatherData.daily;
  const daysCount = Math.min(daily.time.length, 7);

  // Find absolute min/max for temp bar scaling
  let globalMin = 100;
  let globalMax = -100;
  for (let i = 0; i < daysCount; i++) {
    if (daily.temperature_2m_min[i] < globalMin) globalMin = daily.temperature_2m_min[i];
    if (daily.temperature_2m_max[i] > globalMax) globalMax = daily.temperature_2m_max[i];
  }
  const range = globalMax - globalMin || 1;

  const rowsHtml = [];

  for (let i = 0; i < daysCount; i++) {
    const dateObj = new Date(daily.time[i] + 'T00:00:00');
    const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const condition = getWeatherConditionInfo(daily.weather_code[i], 1);

    const maxTemp = convertTemp(daily.temperature_2m_max[i], unit);
    const minTemp = convertTemp(daily.temperature_2m_min[i], unit);

    const minPct = Math.max(0, Math.min(100, ((daily.temperature_2m_min[i] - globalMin) / range) * 100));
    const maxPct = Math.max(0, Math.min(100, ((daily.temperature_2m_max[i] - globalMin) / range) * 100));
    const widthPct = Math.max(15, maxPct - minPct);

    const isToday = i === 0;

    rowsHtml.push(`
      <div class="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl ${isToday ? 'bg-primary-container/10 border border-primary-container/20 shadow-sm' : 'hover:bg-surface-variant/40'} transition-colors">
        <div class="w-20 sm:w-24">
          <span class="block font-bold text-xs sm:text-sm ${isToday ? 'text-primary-container' : 'text-on-background'}">${dayName}</span>
          <span class="text-[10px] sm:text-xs text-on-surface-variant truncate block">${condition.text}</span>
        </div>

        <span class="material-symbols-outlined text-primary-container text-xl sm:text-2xl" style='font-variation-settings: "FILL" 1;'>
          ${condition.icon}
        </span>

        <div class="flex items-center gap-2 sm:gap-3 w-28 sm:w-36 justify-end">
          <span class="text-on-surface-variant text-xs sm:text-sm font-medium w-8 text-right">${minTemp}°</span>
          <div class="h-1.5 flex-1 rounded-full bg-surface-variant overflow-hidden">
            <div class="h-full bg-primary-container rounded-full" style="width: ${widthPct}%; margin-left: ${minPct}%;"></div>
          </div>
          <span class="text-on-background font-bold text-xs sm:text-sm w-8 text-right">${maxTemp}°</span>
        </div>
      </div>
    `);
  }

  return `
    <div class="glass-panel rounded-3xl p-5 sm:p-7 flex flex-col h-full">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base sm:text-lg font-bold text-on-background flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-container text-xl">calendar_month</span>
          7-Day Forecast
        </h3>
      </div>

      <div class="flex-1 space-y-2 overflow-y-auto pr-1 hide-scrollbar">
        ${rowsHtml.join('')}
      </div>
    </div>
  `;
}
