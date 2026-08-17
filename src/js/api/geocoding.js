// src/js/api/geocoding.js

function countryCodeToFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding HTTP error ${res.status}`);
    const data = await res.json();

    if (!data.results) return [];

    return data.results.map(item => ({
      id: item.id,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      flag: countryCodeToFlagEmoji(item.country_code),
      latitude: item.latitude,
      longitude: item.longitude,
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto',
      population: item.population || 0
    }));
  } catch (err) {
    console.error('Error fetching city search results:', err);
    return [];
  }
}

export async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // Attempt reverse geocoding via Open-Meteo or BigDataCloud
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            resolve({
              name: data.city || data.locality || data.principalSubdivision || 'Your Location',
              country: data.countryName || '',
              countryCode: data.countryCode || '',
              latitude: lat,
              longitude: lon,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
            return;
          }
        } catch (e) {
          console.warn('Reverse geocode fallback:', e);
        }

        resolve({
          name: 'Current Location',
          country: '',
          countryCode: '',
          latitude: lat,
          longitude: lon,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      },
      (err) => {
        reject(err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
