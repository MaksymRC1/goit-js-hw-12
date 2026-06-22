import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';

const galleryContainer = document.querySelector('#gallery');
const loadMoreBtn = document.querySelector('#load-more-btn');
const loader = document.querySelector('#loader');
let lightbox = null;

function initLightbox() {
  if (lightbox) {
    lightbox.destroy();
  }

  lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
    animationSpeed: 300,
    fadeSpeed: 300,
  });
}

export async function createGallery(images, append = false) {
  try {
    if (!galleryContainer) {
      throw new Error('Gallery container not found');
    }

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error('No images to display');
    }

    const galleryMarkup = images
      .map(
        image => `
          <li class="gallery-item">
              <a href="${image.largeImageURL}" class="gallery-link">
                  <img 
                      src="${image.webformatURL}" 
                      alt="${image.tags}" 
                      title="${image.tags}"
                      loading="lazy"
                  />
                  <div class="image-info">
                      <div class="info-item">
                          <span class="info-label">👍 Likes</span>
                          <span class="info-value">${image.likes}</span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">👁️ Views</span>
                          <span class="info-value">${image.views}</span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">💬 Comments</span>
                          <span class="info-value">${image.comments}</span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">📥 Downloads</span>
                          <span class="info-value">${image.downloads}</span>
                      </div>
                  </div>
              </a>
          </li>
      `
      )
      .join('');

    if (append) {
      galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);
    } else {
      galleryContainer.innerHTML = galleryMarkup;
    }

    await updateLightbox();
  } catch (error) {
    console.error('Помилка при створенні галереї:', error);
    throw error;
  }
}

async function updateLightbox() {
  try {
    if (!lightbox) {
      initLightbox();
    } else {
      lightbox.refresh();
    }
  } catch (error) {
    console.error('Помилка при оновленні лайтбоксу:', error);
    throw error;
  }
}

export async function clearGallery() {
  try {
    if (galleryContainer) {
      galleryContainer.innerHTML = '';
    }
  } catch (error) {
    console.error('Помилка при очищенні галереї:', error);
    throw error;
  }
}

export function showLoadMoreBtn() {
  if (loadMoreBtn) {
    loadMoreBtn.style.display = 'block';
  }
}

export function hideLoadMoreBtn() {
  if (loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
  }
}

export async function showLoader() {
  try {
    if (loader) {
      loader.style.display = 'block';
      loader.classList.add('is-active');
    }
  } catch (error) {
    console.error('Помилка при показі завантажувача:', error);
  }
}

export async function hideLoader() {
  try {
    if (loader) {
      loader.style.display = 'none';
      loader.classList.remove('is-active');
    }
  } catch (error) {
    console.error('Помилка при прихованні завантажувача:', error);
  }
}

export function showEndMessage() {
  const wrapper = document.querySelector('.load-more-wrapper');
  if (!wrapper) return;

  let message = wrapper.querySelector('.end-message');
  if (!message) {
    message = document.createElement('p');
    message.className = 'end-message';
    message.textContent =
      "We're sorry, but you've reached the end of search results.";
    wrapper.insertBefore(message, loadMoreBtn);
  }
  message.style.display = 'block';
}

export function hideEndMessage() {
  const wrapper = document.querySelector('.load-more-wrapper');
  if (!wrapper) return;

  const message = wrapper.querySelector('.end-message');
  if (message) {
    message.style.display = 'none';
  }
}

export default {
  createGallery,
  clearGallery,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  showLoader,
  hideLoader,
  showEndMessage,
  hideEndMessage,
};
