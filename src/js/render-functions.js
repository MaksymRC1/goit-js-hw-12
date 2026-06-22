// src/js/render-functions.js
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';

const galleryContainer = document.querySelector('.gallery');
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

export function createGallery(images) {
  if (!galleryContainer) return;

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

  galleryContainer.innerHTML = galleryMarkup;

  if (!lightbox) {
    initLightbox();
  } else {
    lightbox.refresh();
  }
}

export function clearGallery() {
  if (galleryContainer) {
    galleryContainer.innerHTML = '';
  }
}

export function showLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.classList.add('is-active');
  }
}

export function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.classList.remove('is-active');
  }
}
