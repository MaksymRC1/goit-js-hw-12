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
 * Плавна прокрутка сторінки до нових зображень
 */
function smoothScrollToNewImages() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  // Отримуємо висоту однієї карточки галереї
  const firstItem = galleryItems[0];
  const cardHeight = firstItem.getBoundingClientRect().height;

  // Прокручуємо на дві висоти карточки
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
    // Дійшли до кінця колекції
    hideLoadMoreBtn();
    showEndMessage();
    return false;
  } else {
    // Є ще зображення для завантаження
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
        throw new Error('No images found for your search query');
      } else {
        // Якщо на наступних сторінках немає результатів
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
    }

    // Якщо це перша сторінка і зображень менше ніж PER_PAGE
    if (page === 1 && data.hits.length < PER_PAGE) {
      hideLoadMoreBtn();
      showEndMessage();
    }
  } catch (error) {
    console.error('Помилка пошуку:', error);

    if (page === 1) {
      // Перша сторінка - очищаємо галерею та показуємо помилку
      await clearGallery();
      hideLoadMoreBtn();
      hideEndMessage();
      alert(`Помилка: ${error.message}`);
    } else {
      // Помилка при завантаженні додаткових зображень
      alert(`Помилка завантаження: ${error.message}`);
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

  if (!query) {
    alert('Будь ласка, введіть пошуковий запит');
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
  } catch (error) {
    console.error('Помилка ініціалізації:', error);
  }
}

initApp();
