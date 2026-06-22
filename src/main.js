import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {
  createGallery,
  clearGallery,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  showLoader,
  hideLoader,
  showEndMessage,
  hideEndMessage,
} from './js/render-functions.js';
import { getImagesByQueryAsync } from './js/pixabay-api.js';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const loadMoreBtn = document.querySelector('#load-more-btn');

// Глобальні змінні для зберігання стану
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
const PER_PAGE = 15;

/**
 * Показує повідомлення про помилку через iziToast
 */
function showErrorToast(message) {
  iziToast.error({
    title: '❌ Помилка',
    message: message,
    position: 'topRight',
    timeout: 5000,
    progressBar: true,
    close: true,
    animateInside: true,
  });
}

/**
 * Показує інформаційне повідомлення через iziToast
 */
function showInfoToast(message) {
  iziToast.info({
    title: 'ℹ️ Інформація',
    message: message,
    position: 'topRight',
    timeout: 3000,
    progressBar: true,
    close: true,
    animateInside: true,
  });
}

/**
 * Показує повідомлення про успіх через iziToast
 */
function showSuccessToast(message) {
  iziToast.success({
    title: '✅ Успіх',
    message: message,
    position: 'topRight',
    timeout: 3000,
    progressBar: true,
    close: true,
    animateInside: true,
  });
}

/**
 * Показує попередження через iziToast
 */
function showWarningToast(message) {
  iziToast.warning({
    title: '⚠️ Попередження',
    message: message,
    position: 'topRight',
    timeout: 4000,
    progressBar: true,
    close: true,
    animateInside: true,
  });
}

/**
 * Плавна прокрутка сторінки до нових зображень
 */
function smoothScrollToNewImages() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  const firstItem = galleryItems[0];
  const cardHeight = firstItem.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

/**
 * Перевірка чи є ще зображення для завантаження
 */
function checkIfMoreImagesAvailable() {
  const totalPages = Math.ceil(totalHits / PER_PAGE);

  if (currentPage >= totalPages || totalHits === 0) {
    hideLoadMoreBtn();
    showEndMessage();
    return false;
  } else {
    showLoadMoreBtn();
    hideEndMessage();
    return true;
  }
}

/**
 * Асинхронна функція для пошуку зображень
 */
async function searchImages(query, page = 1, append = false) {
  try {
    hideLoadMoreBtn();
    hideEndMessage();
    await showLoader();

    const data = await getImagesByQueryAsync(query, page, PER_PAGE);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      if (page === 1) {
        showWarningToast(
          'За вашим запитом нічого не знайдено. Спробуйте інші ключові слова.'
        );
        await clearGallery();
        hideLoadMoreBtn();
        hideEndMessage();
        return;
      } else {
        hideLoadMoreBtn();
        showEndMessage();
        return;
      }
    }

    await createGallery(data.hits, append);
    checkIfMoreImagesAvailable();

    if (append && page > 1) {
      smoothScrollToNewImages();
      showSuccessToast(`Завантажено ще ${data.hits.length} зображень`);
    }

    if (page === 1 && data.hits.length < PER_PAGE) {
      hideLoadMoreBtn();
      showEndMessage();
    }

    if (page === 1) {
      showInfoToast(`Знайдено ${totalHits} зображень за запитом "${query}"`);
    }
  } catch (error) {
    console.error('Помилка пошуку:', error);

    if (page === 1) {
      await clearGallery();
      hideLoadMoreBtn();
      hideEndMessage();
      showErrorToast(`Помилка: ${error.message}`);
    } else {
      showErrorToast(`Помилка завантаження: ${error.message}`);
      currentPage = page - 1;
      checkIfMoreImagesAvailable();
    }
  } finally {
    await hideLoader();
  }
}

/**
 * Обробник форми
 */
searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    showWarningToast('Будь ласка, введіть пошуковий запит');
    return;
  }

  currentQuery = query;
  currentPage = 1;

  await clearGallery();
  hideLoadMoreBtn();
  hideEndMessage();

  await searchImages(currentQuery, currentPage, false);
});

/**
 * Обробник кнопки "Load more"
 */
loadMoreBtn.addEventListener('click', async () => {
  if (!currentQuery) {
    return;
  }

  const totalPages = Math.ceil(totalHits / PER_PAGE);
  if (currentPage >= totalPages) {
    hideLoadMoreBtn();
    showEndMessage();
    return;
  }

  currentPage += 1;
  await searchImages(currentQuery, currentPage, true);
});

/**
 * Ініціалізація додатку
 */
async function initApp() {
  try {
    console.log('📸 Image Gallery додаток успішно ініціалізовано');
    console.log(`📊 На сторінці відображається ${PER_PAGE} зображень`);

    hideLoadMoreBtn();
    await hideLoader();
    hideEndMessage();

    // Показуємо вітальне повідомлення
    showInfoToast('Введіть пошуковий запит для пошуку зображень');
  } catch (error) {
    console.error('Помилка ініціалізації:', error);
  }
}

initApp();
