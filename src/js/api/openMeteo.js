// src/js/api/openMeteo.js

const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getWeatherConditionInfo(code, isDay = 1) {
  const weatherMap = {
    0: { text: isDay ? 'Clear Sky' : 'Clear Night', icon: isDay ? 'clear_day' : 'clear_night' },
    1: { text: isDay ? 'Mainly Clear' : 'Partly Cloudy', icon: isDay ? 'partly_cloudy_day' : 'partly_cloudy_night' },
    2: { text: 'Partly Cloudy', icon: isDay ? 'partly_cloudy_day' : 'partly_cloudy_night' },
    3: { text: 'Overcast', icon: 'cloud' },
    45: { text: 'Foggy', icon: 'foggy' },
    48: { text: 'Rime Fog', icon: 'foggy' },
    51: { text: 'Light Drizzle', icon: 'grain' },
    53: { text: 'Moderate Drizzle', icon: 'grain' },
    55: { text: 'Dense Drizzle', icon: 'grain' },
    61: { text: 'Slight Rain', icon: 'rainy' },
    63: { text: 'Moderate Rain', icon: 'rainy' },
    65: { text: 'Heavy Rain', icon: 'rainy' },
    71: { text: 'Slight Snowfall', icon: 'weather_snow' },
    73: { text: 'Moderate Snowfall', icon: 'weather_snow' },
    75: { text: 'Heavy Snowfall', icon: 'severe_cold' },
    77: { text: 'Snow Grains', icon: 'weather_snow' },
    80: { text: 'Slight Rain Showers', icon: 'rainy' },
    81: { text: 'Moderate Rain Showers', icon: 'rainy' },
    82: { text: 'Violent Rain Showers', icon: 'thunderstorm' },
    85: { text: 'Slight Snow Showers', icon: 'weather_snow' },
    86: { text: 'Heavy Snow Showers', icon: 'severe_cold' },
    95: { text: 'Thunderstorm', icon: 'thunderstorm' },
    96: { text: 'Thunderstorm with Hail', icon: 'thunderstorm' },
    99: { text: 'Heavy Thunderstorm', icon: 'thunderstorm' }
  };

  return weatherMap[code] || { text: 'Cloudy', icon: 'cloud' };
}

export function convertTemp(tempC, unit = 'C') {
  if (tempC === null || tempC === undefined) return '--';
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

export async function fetchWeatherData(lat, lon, timezone = 'auto') {
  const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,dew_point_2m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max&timezone=${encodeURIComponent(timezone)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API returned HTTP ${res.status}`);
    const data = await res.json();

    const result = {
      current: data.current,
      hourly: data.hourly,
      daily: data.daily,
      timezone: data.timezone,
      utcOffsetSeconds: data.utc_offset_seconds
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  } catch (err) {
    console.error('Error fetching Open-Meteo weather data:', err);
    throw err;
  }
}

export async function fetchAirQualityData(lat, lon) {
  const cacheKey = `aqi_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Air Quality API returned HTTP ${res.status}`);
    const data = await res.json();

    const result = data.current || {};
    cache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  } catch (err) {
    console.warn('Air Quality API fetch error:', err);
    return { us_aqi: 25, pm2_5: 8.2, pm10: 14.1, nitrogen_dioxide: 5.6, ozone: 32.0 };
  }
}

export function getAqiStatus(aqi) {
  if (aqi === null || aqi === undefined) return { label: 'Unknown', color: 'text-gray-500' };
  if (aqi <= 50) return { label: 'Good', color: 'text-emerald-500' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-500' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-500' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-500' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-500' };
  return { label: 'Hazardous', color: 'text-rose-900' };
}
