import axios from 'axios';

const PIXABAY_BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '48876382-0e4f5cbb23d48eb9ff8904d68';
const MIN_PER_PAGE = 15; // Мінімальна кількість зображень на сторінку

/**
 * Асинхронна функція для пошуку зображень з підтримкою пагінації
 * @param {string} query - Пошуковий запит
 * @param {number} page - Номер сторінки (за замовчуванням 1)
 * @param {number} perPage - Кількість об'єктів на сторінку (мінімум 15)
 * @returns {Promise<object>} - Promise з даними відповіді
 */
export async function getImagesByQueryAsync(query, page = 1, perPage = 15) {
  try {
    // Валідація query
    if (query === undefined || query === null) {
      throw new Error('Query parameter is required');
    }

    if (typeof query !== 'string') {
      throw new Error('Query must be a string');
    }

    const searchQuery = query.trim();

    if (searchQuery === '') {
      throw new Error('Search query cannot be empty');
    }

    // Валідація page
    if (typeof page !== 'number' || page < 1) {
      throw new Error('Page must be a positive number');
    }

    // Валідація perPage - встановлюємо мінімальне значення 15
    let validatedPerPage = perPage;
    if (typeof perPage !== 'number' || perPage < 1) {
      validatedPerPage = MIN_PER_PAGE;
    } else if (perPage < MIN_PER_PAGE) {
      validatedPerPage = MIN_PER_PAGE;
    }

    const params = new URLSearchParams({
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true', // Явно передаємо як рядок
      per_page: validatedPerPage,
      page: page,
    });

    const response = await axios.get(`${PIXABAY_BASE_URL}?${params}`);

    // Перевірка відповіді
    if (!response.data) {
      throw new Error('Empty response from Pixabay API');
    }

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
  getImagesByQueryAsync,
};
