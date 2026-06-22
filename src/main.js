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
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutUp',
    backgroundColor: '#ff6b6b',
    titleColor: '#ffffff',
    messageColor: '#ffffff',
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
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutUp',
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
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutUp',
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
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutUp',
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
    // Ховаємо кнопку та повідомлення під час завантаження
    hideLoadMoreBtn();
    hideEndMessage();

    // Показуємо індикатор завантаження
    await showLoader();

    const data = await getImagesByQueryAsync(query, page, PER_PAGE);

    // Зберігаємо загальну кількість знайдених зображень
    totalHits = data.totalHits;

    // Перевіряємо чи є результати
    if (data.hits.length === 0) {
      if (page === 1) {
        // Немає результатів пошуку
        showWarningToast(
          'За вашим запитом нічого не знайдено. Спробуйте інші ключові слова.'
        );
        await clearGallery();
        hideLoadMoreBtn();
        hideEndMessage();
        return;
      } else {
        // Кінець колекції
        hideLoadMoreBtn();
        showEndMessage();
        return;
      }
    }

    // Створюємо галерею (додаємо або перезаписуємо)
    await createGallery(data.hits, append);

    // Перевіряємо чи є ще зображення для завантаження
    checkIfMoreImagesAvailable();

    // Плавна прокрутка при додаванні нових зображень
    if (append && page > 1) {
      smoothScrollToNewImages();
      showSuccessToast(`Завантажено ще ${data.hits.length} зображень`);
    }

    // Якщо це перша сторінка і зображень менше ніж PER_PAGE
    if (page === 1 && data.hits.length < PER_PAGE) {
      hideLoadMoreBtn();
      showEndMessage();
    }

    // Показуємо інформацію про кількість знайдених зображень (тільки для першої сторінки)
    if (page === 1 && data.hits.length > 0) {
      showInfoToast(`Знайдено ${totalHits} зображень за запитом "${query}"`);
    }
  } catch (error) {
    console.error('Помилка пошуку:', error);

    if (page === 1) {
      // Перша сторінка - очищаємо галерею та показуємо помилку
      await clearGallery();
      hideLoadMoreBtn();
      hideEndMessage();
      showErrorToast(`Помилка: ${error.message}`);
    } else {
      // Помилка при завантаженні додаткових зображень
      showErrorToast(`Помилка завантаження: ${error.message}`);
      // Повертаємо сторінку назад
      currentPage = page - 1;
      // Показуємо кнопку знову якщо є ще зображення
      checkIfMoreImagesAvailable();
    }
  } finally {
    // Ховаємо індикатор завантаження
    await hideLoader();
  }
}

/**
 * Обробник форми
 */
searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const query = searchInput.value.trim();

  // Перевірка на порожнє поле
  if (!query) {
    showWarningToast('Будь ласка, введіть пошуковий запит');
    return;
  }

  // Зберігаємо пошуковий запит у глобальну змінну
  currentQuery = query;
  currentPage = 1;

  // Очищаємо попередні результати
  await clearGallery();
  hideLoadMoreBtn();
  hideEndMessage();

  // Виконуємо пошук
  await searchImages(currentQuery, currentPage, false);
});

/**
 * Обробник кнопки "Load more"
 */
loadMoreBtn.addEventListener('click', async () => {
  if (!currentQuery) {
    showWarningToast('Спочатку виконайте пошук');
    return;
  }

  // Перевіряємо чи не дійшли до кінця
  const totalPages = Math.ceil(totalHits / PER_PAGE);
  if (currentPage >= totalPages) {
    hideLoadMoreBtn();
    showEndMessage();
    return;
  }

  // Збільшуємо сторінку
  currentPage += 1;

  // Завантажуємо наступну сторінку (додаємо до існуючої галереї)
  await searchImages(currentQuery, currentPage, true);
});

/**
 * Ініціалізація додатку
 */
async function initApp() {
  try {
    console.log('📸 Image Gallery додаток успішно ініціалізовано');
    console.log(`📊 На сторінці відображається ${PER_PAGE} зображень`);

    // Приховуємо кнопку та індикатор завантаження при старті
    hideLoadMoreBtn();
    await hideLoader();
    hideEndMessage();

    // Показуємо вітальне повідомлення
    setTimeout(() => {
      showInfoToast('Введіть пошуковий запит для пошуку зображень');
    }, 500);
  } catch (error) {
    console.error('Помилка ініціалізації:', error);
  }
}

initApp();
