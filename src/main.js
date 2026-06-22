// src/js/main.js
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'pure-css-loader/dist/css-loader.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const searchInput = document.querySelector('input[name="search-text"]');

function showError(message) {
  iziToast.error({
    title: '❌ Error',
    message: message,
    position: 'topRight',
    backgroundColor: '#ef4444',
    timeout: 5000,
  });
}

function showNoResults(query) {
  iziToast.info({
    title: '🔍 No Results',
    message: `No images found for "${query}". Try another search term.`,
    position: 'topRight',
    backgroundColor: '#3b82f6',
    timeout: 5000,
  });
}

function showSuccessMessage(count) {
  iziToast.success({
    title: '✅ Success',
    message: `Found ${count} beautiful images!`,
    position: 'topRight',
    backgroundColor: '#10b981',
    timeout: 3000,
  });
}

function searchImages(query) {
  if (!query || query.trim() === '') {
    showError('Please enter a search query');
    return;
  }

  clearGallery();
  showLoader();

  getImagesByQuery(query)
    .then(data => {
      if (!data.hits || data.hits.length === 0) {
        showNoResults(query);
        return;
      }

      createGallery(data.hits);
      showSuccessMessage(data.totalHits);

      const gallery = document.querySelector('.gallery');
      if (gallery && gallery.children.length > 0) {
        gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    })
    .catch(error => {
      console.error('Search error:', error);
      showError(error.message);
    })
    .finally(() => {
      hideLoader();
    });
}

function onSearchFormSubmit(event) {
  event.preventDefault();
  const query = searchInput.value;
  searchImages(query);
}

function init() {
  if (!searchForm) {
    console.error('Form not found');
    return;
  }
  searchForm.addEventListener('submit', onSearchFormSubmit);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
