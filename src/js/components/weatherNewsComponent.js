// src/js/components/weatherNewsComponent.js

export function renderWeatherNewsComponent(state) {
  const { newsData } = state;

  if (!newsData || newsData.length === 0) {
    return `
      <div class="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center min-h-[350px]">
        <span class="material-symbols-outlined text-4xl text-primary-container animate-spin mb-3">newspaper</span>
        <p class="text-on-surface-variant font-medium text-sm">Fetching real-time weather news bulletins...</p>
      </div>
    `;
  }

  const newsItemsHtml = newsData.map((item, index) => `
    <div 
      data-news-id="${item.id}"
      class="news-card-btn glass-panel rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:border-primary-container/40 transition-all cursor-pointer group shadow-sm"
    >
      <div>
        <!-- Image Header -->
        <div class="w-full h-40 sm:h-48 rounded-2xl overflow-hidden mb-4 relative bg-surface-container">
          <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          <span class="absolute top-3 left-3 bg-primary-container text-on-primary-container text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-md">
            ${item.category}
          </span>
        </div>

        <div class="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
          <span class="font-bold text-primary-container">${item.source}</span>
          <span>•</span>
          <span>${item.timeAgo}</span>
        </div>

        <h4 class="text-base sm:text-lg font-bold text-on-background group-hover:text-primary-container transition-colors line-clamp-2 leading-snug mb-2">
          ${item.title}
        </h4>

        <p class="text-xs sm:text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
          ${item.summary}
        </p>
      </div>

      <div class="pt-4 mt-4 border-t border-outline-variant/15 flex items-center justify-between text-xs font-bold text-primary-container">
        <span>Read Full Story</span>
        <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="fade-in-up">
      <!-- Header Banner -->
      <div class="glass-panel rounded-3xl p-5 sm:p-7 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-on-background flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-container text-2xl">newspaper</span>
              Live Weather & Climate News
            </h2>
            <p class="text-xs sm:text-sm text-on-surface-variant mt-1">
              Real-time meteorological bulletins, storm warnings, and climate insights.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">Live News Feed</span>
          </div>
        </div>
      </div>

      <!-- News Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        ${newsItemsHtml}
      </div>

      <!-- Article Modal Reader Container -->
      <div id="news-story-modal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-panel rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative hide-scrollbar">
          <button type="button" id="close-news-modal-btn" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
          
          <div id="news-modal-content"></div>
        </div>
      </div>
    </div>
  `;
}

export function initWeatherNewsEvents(state) {
  const cards = document.querySelectorAll('.news-card-btn');
  const modal = document.getElementById('news-story-modal');
  const modalContent = document.getElementById('news-modal-content');
  const closeBtn = document.getElementById('close-news-modal-btn');

  if (!modal || !modalContent) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const newsId = card.getAttribute('data-news-id');
      const item = state.newsData ? state.newsData.find(n => n.id === newsId) : null;
      if (!item) return;

      modalContent.innerHTML = `
        <span class="bg-primary-container text-on-primary-container text-xs font-bold uppercase px-3 py-1 rounded-full">
          ${item.category}
        </span>

        <h3 class="text-xl sm:text-2xl font-bold text-on-background mt-3 mb-2 leading-snug">
          ${item.title}
        </h3>

        <div class="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
          <span class="font-bold text-primary-container">${item.source}</span>
          <span>•</span>
          <span>${item.pubDate} (${item.timeAgo})</span>
        </div>

        <div class="w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-4">
          <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover"/>
        </div>

        <div class="text-sm text-on-surface leading-relaxed space-y-3 font-body-md">
          <p class="font-semibold text-base">${item.summary}</p>
          <p>${item.fullContent}</p>
        </div>

        ${item.link && item.link !== '#' ? `
          <div class="mt-6 pt-4 border-t border-outline-variant/20 flex justify-end">
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-bold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span>Read Original Article</span>
              <span class="material-symbols-outlined text-base">open_in_new</span>
            </a>
          </div>
        ` : ''}
      `;

      modal.classList.remove('hidden');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
}
