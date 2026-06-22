import{S as E,a as S}from"./assets/vendor-CCnRgD5_.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const w of n.addedNodes)w.tagName==="LINK"&&w.rel==="modulepreload"&&t(w)}).observe(document,{childList:!0,subtree:!0});function s(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(o){if(o.ep)return;o.ep=!0;const n=s(o);fetch(o.href,n)}})();const c=document.querySelector("#gallery"),f=document.querySelector("#load-more-btn"),l=document.querySelector("#loader");let u=null;function P(){u&&u.destroy(),u=new E(".gallery a",{captions:!0,captionsData:"alt",captionDelay:250,captionPosition:"bottom",animationSpeed:300,fadeSpeed:300})}async function $(e,r=!1){try{if(!c)throw new Error("Gallery container not found");if(!Array.isArray(e)||e.length===0)throw new Error("No images to display");const s=e.map(t=>`
          <li class="gallery-item">
              <a href="${t.largeImageURL}" class="gallery-link">
                  <img 
                      src="${t.webformatURL}" 
                      alt="${t.tags}" 
                      title="${t.tags}"
                      loading="lazy"
                  />
                  <div class="image-info">
                      <div class="info-item">
                          <span class="info-label">👍 Likes</span>
                          <span class="info-value">${t.likes}</span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">👁️ Views</span>
                          <span class="info-value">${t.views}</span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">💬 Comments</span>
                          <span class="info-value">${t.comments}</span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">📥 Downloads</span>
                          <span class="info-value">${t.downloads}</span>
                      </div>
                  </div>
              </a>
          </li>
      `).join("");r?c.insertAdjacentHTML("beforeend",s):c.innerHTML=s,await q()}catch(s){throw console.error("Помилка при створенні галереї:",s),s}}async function q(){try{u?u.refresh():P()}catch(e){throw console.error("Помилка при оновленні лайтбоксу:",e),e}}async function b(){try{c&&(c.innerHTML="")}catch(e){throw console.error("Помилка при очищенні галереї:",e),e}}function I(){f&&(f.style.display="block")}function a(){f&&(f.style.display="none")}async function A(){try{l&&(l.style.display="block",l.classList.add("is-active"))}catch(e){console.error("Помилка при показі завантажувача:",e)}}async function v(){try{l&&(l.style.display="none",l.classList.remove("is-active"))}catch(e){console.error("Помилка при прихованні завантажувача:",e)}}function m(){const e=document.querySelector(".load-more-wrapper");if(!e)return;let r=e.querySelector(".end-message");r||(r=document.createElement("p"),r.className="end-message",r.textContent="We're sorry, but you've reached the end of search results.",e.insertBefore(r,f)),r.style.display="block"}function d(){const e=document.querySelector(".load-more-wrapper");if(!e)return;const r=e.querySelector(".end-message");r&&(r.style.display="none")}const M="https://pixabay.com/api/",B="48876382-0e4f5cbb23d48eb9ff8904d68";async function x(e,r=1,s=15){try{let t="";if(e==null)throw new Error("Query parameter is required");if(typeof e!="string")throw new Error("Query must be a string");if(t=e.trim(),t==="")throw new Error("Search query cannot be empty");if(typeof r!="number"||r<1)throw new Error("Page must be a positive number");if(typeof s!="number"||s<1)throw new Error("perPage must be a positive number");const o=new URLSearchParams({key:B,q:t,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:s,page:r});return(await S.get(`${M}?${o}`)).data}catch(t){throw t.response?new Error(`API Error: ${t.response.status} - ${t.response.statusText}`):t.request?new Error("No response received from Pixabay API. Please check your internet connection."):new Error(`Request error: ${t.message}`)}}const N=document.querySelector("#search-form"),R=document.querySelector("#search-input"),k=document.querySelector("#load-more-btn");let i=1,p="",h=0;const y=15;function H(){const e=document.querySelectorAll(".gallery-item");if(e.length===0)return;const s=e[0].getBoundingClientRect().height;window.scrollBy({top:s*2,behavior:"smooth"})}function g(){const e=Math.ceil(h/y);return i>=e||h===0?(a(),m(),!1):(I(),d(),!0)}async function L(e,r=1,s=!1){try{a(),d(),await A();const t=await x(e,r,y);if(h=t.totalHits,t.hits.length===0){if(r===1)throw new Error("No images found for your search query");a(),m();return}await $(t.hits,s),g(),s&&r>1&&H(),r===1&&t.hits.length<y&&(a(),m())}catch(t){console.error("Помилка пошуку:",t),r===1?(await b(),a(),d(),alert(`Помилка: ${t.message}`)):(alert(`Помилка завантаження: ${t.message}`),i=r-1,g())}finally{await v()}}N.addEventListener("submit",async e=>{e.preventDefault();const r=R.value.trim();if(!r){alert("Будь ласка, введіть пошуковий запит");return}p=r,i=1,await b(),a(),d(),await L(p,i,!1)});k.addEventListener("click",async()=>{if(!p)return;const e=Math.ceil(h/y);if(i>=e){a(),m();return}i+=1,await L(p,i,!0)});async function O(){try{console.log("📸 Image Gallery додаток успішно ініціалізовано"),console.log(`📊 На сторінці відображається ${y} зображень`),a(),await v(),d()}catch(e){console.error("Помилка ініціалізації:",e)}}O();
//# sourceMappingURL=index.js.map
