// src/js/components/header.js

import { stateManager } from '../state.js';
import { searchCities, getUserLocation } from '../api/geocoding.js';

export function initHeader() {
  const searchInput = document.getElementById('search-input');
  const searchDropdown = document.getElementById('search-dropdown');
  const locationBtn = document.getElementById('my-location-btn');
  const favBtn = document.getElementById('fav-toggle-btn');
  const themeBtn = document.getElementById('theme-toggle-btn');
  const unitBtn = document.getElementById('unit-toggle-btn');

  let debounceTimer = null;

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim();

      if (query.length < 2) {
        hideDropdown();
        return;
      }

      debounceTimer = setTimeout(async () => {
        const results = await searchCities(query);
        renderSearchDropdown(results);
      }, 250);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim().length >= 2 && searchDropdown.children.length > 0) {
        showDropdown();
      }
    });

    // Close dropdown on outside tap/click
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        hideDropdown();
      }
    });
  }

  function showDropdown() {
    searchDropdown.classList.remove('hidden');
  }

  function hideDropdown() {
    searchDropdown.classList.add('hidden');
  }

  function renderSearchDropdown(results) {
    if (!searchDropdown) return;

    if (results.length === 0) {
      searchDropdown.innerHTML = `
        <div class="px-4 py-3 text-sm text-on-surface-variant text-center">
          No cities found matching your search
        </div>
      `;
      showDropdown();
      return;
    }

    searchDropdown.innerHTML = results.map(city => `
      <div 
        data-city-json="${encodeURIComponent(JSON.stringify(city))}"
        class="search-item-btn flex items-center justify-between p-3 hover:bg-primary-container/10 dark:hover:bg-white/10 rounded-2xl cursor-pointer transition-colors"
      >
        <div class="flex items-center space-x-3">
          <span class="text-xl">${city.flag}</span>
          <div>
            <div class="font-semibold text-on-surface text-sm sm:text-base">${city.name}</div>
            <div class="text-xs text-on-surface-variant">${city.admin1 ? city.admin1 + ', ' : ''}${city.country}</div>
          </div>
        </div>
        <span class="material-symbols-outlined text-primary-container text-lg opacity-0 hover:opacity-100 transition-opacity">location_on</span>
      </div>
    `).join('');

    // Attach touchstart and mousedown to prevent Android soft keyboard blur from hiding dropdown before selection!
    const items = searchDropdown.querySelectorAll('.search-item-btn');
    items.forEach(item => {
      const handleSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const cityData = JSON.parse(decodeURIComponent(item.getAttribute('data-city-json')));
        stateManager.setLocation(cityData);
        if (searchInput) searchInput.value = `${cityData.name}, ${cityData.country}`;
        hideDropdown();
      };

      item.addEventListener('touchstart', handleSelect, { passive: false });
      item.addEventListener('mousedown', handleSelect);
    });

    showDropdown();
  }

  // Geolocation button
  if (locationBtn) {
    locationBtn.addEventListener('click', async () => {
      try {
        locationBtn.classList.add('animate-spin');
        const loc = await getUserLocation();
        stateManager.setLocation(loc);
        if (searchInput) searchInput.value = `${loc.name}`;
      } catch (err) {
        alert('Could not retrieve current location. Please check browser permissions.');
      } finally {
        locationBtn.classList.remove('animate-spin');
      }
    });
  }

  // Favorite button
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      stateManager.toggleFavorite();
    });
  }

  // Theme button
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      stateManager.toggleTheme();
    });
  }

  // Unit switcher button
  if (unitBtn) {
    unitBtn.addEventListener('click', () => {
      stateManager.toggleUnit();
    });
  }

  // Desktop side nav buttons
  const desktopNavBtns = document.querySelectorAll('#desktop-side-nav button[data-tab]');
  desktopNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      stateManager.setActiveTab(tab);
    });
  });

  // Mobile bottom nav buttons
  const mobileNavBtns = document.querySelectorAll('#mobile-bottom-nav button[data-tab]');
  mobileNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      stateManager.setActiveTab(tab);
    });
  });

  // Subscribe state updates to sync UI button states
  stateManager.subscribe((state, changedKeys) => {
    if (changedKeys.includes('favorites') || changedKeys.includes('currentCity')) {
      const isFav = stateManager.isCurrentFavorite();
      if (favBtn) {
        const icon = favBtn.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.textContent = isFav ? 'bookmark' : 'bookmark_border';
          icon.className = isFav
            ? 'material-symbols-outlined text-primary-container text-xl'
            : 'material-symbols-outlined text-on-surface-variant text-xl';
        }
      }
    }

    if (changedKeys.includes('unit')) {
      if (unitBtn) {
        unitBtn.textContent = `°${state.unit}`;
      }
    }

    if (changedKeys.includes('theme')) {
      if (themeBtn) {
        const icon = themeBtn.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.textContent = state.theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
      }
    }

    if (changedKeys.includes('activeTab')) {
      updateActiveTabStyles(state.activeTab);
    }
  });

  // Initialize initial button states
  updateActiveTabStyles(stateManager.getState().activeTab);
  if (unitBtn) unitBtn.textContent = `°${stateManager.getState().unit}`;
}

function updateActiveTabStyles(activeTab) {
  // Desktop side nav
  const desktopNavBtns = document.querySelectorAll('#desktop-side-nav button[data-tab]');
  desktopNavBtns.forEach(btn => {
    const tab = btn.getAttribute('data-tab');
    if (tab === activeTab) {
      btn.className = 'w-full bg-primary-container text-on-primary-container rounded-full p-3 flex items-center space-x-4 transition-all font-medium border border-primary-container/20 shadow-md cursor-pointer';
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = '"FILL" 1';
    } else {
      btn.className = 'w-full text-on-surface-variant p-3 flex items-center space-x-4 hover:bg-surface-variant hover:text-on-surface rounded-full transition-all font-medium cursor-pointer';
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = '"FILL" 0';
    }
  });

  // Mobile bottom nav
  const mobileNavBtns = document.querySelectorAll('#mobile-bottom-nav button[data-tab]');
  mobileNavBtns.forEach(btn => {
    const tab = btn.getAttribute('data-tab');
    if (tab === activeTab) {
      btn.className = 'w-full flex flex-col items-center justify-center py-1 px-0.5 text-primary-container font-bold text-[10px] transition-all cursor-pointer';
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = '"FILL" 1';
    } else {
      btn.className = 'w-full flex flex-col items-center justify-center py-1 px-0.5 text-on-surface-variant dark:text-slate-400 font-medium text-[10px] transition-all cursor-pointer';
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = '"FILL" 0';
    }
  });
}
