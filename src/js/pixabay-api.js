import axios from 'axios';

const PIXABAY_BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '48876382-0e4f5cbb23d48eb9ff8904d68';

/**
 * Виконує HTTP-запит до Pixabay API для пошуку зображень з підтримкою пагінації
 * @param {string} query - Пошуковий запит
 * @param {number} page - Номер сторінки (за замовчуванням 1)
 * @param {number} perPage - Кількість об'єктів на сторінку (за замовчуванням 15)
 * @returns {Promise<object>} - Promise з даними відповіді
 */
export function getImagesByQuery(query, page = 1, perPage = 15) {
  // Безпечна перевірка вхідного параметру
  let searchQuery = '';

  // Перевіряємо, чи query взагалі передано
  if (query === undefined || query === null) {
    return Promise.reject(new Error('Query parameter is required'));
  }

  // Перевіряємо, чи query є рядком
  if (typeof query !== 'string') {
    return Promise.reject(new Error('Query must be a string'));
  }

  // Безпечно викликаємо trim() тільки після перевірки, що це рядок
  searchQuery = query.trim();

  // Перевіряємо, чи не порожній рядок після обрізання
  if (searchQuery === '') {
    return Promise.reject(new Error('Search query cannot be empty'));
  }

  // Перевіряємо валідність page
  if (typeof page !== 'number' || page < 1) {
    return Promise.reject(new Error('Page must be a positive number'));
  }

  // Перевіряємо валідність perPage
  if (typeof perPage !== 'number' || perPage < 1) {
    return Promise.reject(new Error('perPage must be a positive number'));
  }

  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page: page,
  });

  return axios
    .get(`${PIXABAY_BASE_URL}?${params}`)
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        throw new Error(
          `API Error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error(
          'No response received from Pixabay API. Please check your internet connection.'
        );
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    });
}

/**
 * Асинхронна версія функції для пошуку зображень
 * @param {string} query - Пошуковий запит
 * @param {number} page - Номер сторінки (за замовчуванням 1)
 * @param {number} perPage - Кількість об'єктів на сторінку (за замовчуванням 15)
 * @returns {Promise<object>} - Promise з даними відповіді
 */
export async function getImagesByQueryAsync(query, page = 1, perPage = 15) {
  try {
    // Безпечна перевірка вхідного параметру
    let searchQuery = '';

    if (query === undefined || query === null) {
      throw new Error('Query parameter is required');
    }

    if (typeof query !== 'string') {
      throw new Error('Query must be a string');
    }

    searchQuery = query.trim();

    if (searchQuery === '') {
      throw new Error('Search query cannot be empty');
    }

    if (typeof page !== 'number' || page < 1) {
      throw new Error('Page must be a positive number');
    }

    if (typeof perPage !== 'number' || perPage < 1) {
      throw new Error('perPage must be a positive number');
    }

    const params = new URLSearchParams({
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: perPage,
      page: page,
    });

    const response = await axios.get(`${PIXABAY_BASE_URL}?${params}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.statusText}`
      );
    } else if (error.request) {
      throw new Error(
        'No response received from Pixabay API. Please check your internet connection.'
      );
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

export default {
  getImagesByQuery,
  getImagesByQueryAsync,
};
