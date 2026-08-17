// src/js/components/hourly24h.js

import { getWeatherConditionInfo, convertTemp } from '../api/openMeteo.js';

export function renderHourly24h(state) {
  const { weatherData, unit } = state;

  if (!weatherData || !weatherData.hourly) {
    return '';
  }

  const hourly = weatherData.hourly;
  const count = Math.min(hourly.time.length, 24);

  const itemsHtml = [];

  for (let i = 0; i < count; i += 1) {
    const dateObj = new Date(hourly.time[i]);
    const hourLabel = i === 0 ? 'Now' : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    const isDay = dateObj.getHours() >= 6 && dateObj.getHours() <= 20 ? 1 : 0;
    const condition = getWeatherConditionInfo(hourly.weather_code[i], isDay);

    const tempVal = convertTemp(hourly.temperature_2m[i], unit);
    const rainProb = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;

    const isNow = i === 0;

    itemsHtml.push(`
      <div class="min-w-[90px] sm:min-w-[105px] flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-3xl ${
        isNow
          ? 'bg-primary-container text-on-primary-container shadow-md border border-primary-container'
          : 'bg-surface-container/40 dark:bg-white/5 hover:bg-surface-variant border border-outline-variant/15'
      } snap-start transition-all cursor-pointer">
        <span class="font-medium text-xs sm:text-sm ${isNow ? 'text-on-primary-container' : 'text-on-surface-variant'}">${hourLabel}</span>
        
        <span class="material-symbols-outlined text-2xl sm:text-3xl my-2 ${isNow ? 'text-on-primary-container' : 'text-primary-container'}" style='font-variation-settings: "FILL" 1;'>
          ${condition.icon}
        </span>
        
        <span class="font-bold text-base sm:text-lg ${isNow ? 'text-on-primary-container' : 'text-on-background'}">${tempVal}°</span>
        
        <span class="text-[10px] sm:text-xs flex items-center gap-0.5 mt-1 ${isNow ? 'opacity-90' : 'text-primary-container'} font-medium">
          <span class="material-symbols-outlined text-xs">water_drop</span>
          ${rainProb}%
        </span>
      </div>
    `);
  }

  return `
    <div class="glass-panel rounded-3xl p-4 sm:p-6 mt-4 sm:mt-6 fade-in-up">
      <div class="flex items-center justify-between mb-3 px-1">
        <h3 class="text-sm sm:text-base font-bold text-on-background flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-container text-lg sm:text-xl">schedule</span>
          Hourly Forecast
        </h3>
        <span class="text-xs text-on-surface-variant font-medium">24 Hours</span>
      </div>

      <div class="flex overflow-x-auto gap-3 sm:gap-4 pb-2 hide-scrollbar snap-x font-body-md">
        ${itemsHtml.join('')}
      </div>
    </div>
  `;
}
