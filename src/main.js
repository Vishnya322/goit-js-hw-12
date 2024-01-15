import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.getElementById('gallery');
const form = document.getElementById('form');
const input = document.getElementById('input');
const btnLoadMore = document.querySelector('.btn-load-more');
const loader = document.querySelector('.loader');


const paramsInfo = {
  key: "41508094-b690cca5e0d97ff8185874dce",
  q: "kat",
  image_type: "photo",
  orientation: "horizontal",
  safesearch: "true",
  page: 1,
  per_page: 40
};

let page = paramsInfo.page;
let per_page = paramsInfo.per_page;
let totalHits;

form.addEventListener('submit', event => {
  event.preventDefault();
  const searchTerm = input.value.trim();
  if (searchTerm) {
  paramsInfo.q = searchTerm;
  paramsInfo.page = 1;
  paramsInfo.per_page = per_page;
  
  searchImg();
  showLoader()
  showLoadMore()
} else {
  iziToast.info({
    position: 'bottomCenter',
    message: "Please enter a search term.",
  });
}
});

btnLoadMore.addEventListener('click', event => {
  event.preventDefault();
  showLoader();
  const searchTerm = input.value.trim();

  if (searchTerm) {
  paramsInfo.q = searchTerm;
  paramsInfo.page += 1;
  paramsInfo.per_page = per_page; 
  searchImg();
} else {
  iziToast.info({
    position: 'bottomCenter',
    message: "Please enter a search term.",
  });
}
});

async function fetchViews(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Sorry, there are no images matching your search query. Please try again!");
  }
  return response.json();
}

async function searchImg() {
  const url = new URL("https://pixabay.com/api/");
  const searchParams = new URLSearchParams(paramsInfo);
   url.search = searchParams.toString();

  try {
    paramsInfo.page = page;
    const { hits, totalHits: hitsCount } = await fetchViews(url, paramsInfo);
    totalHits = hitsCount;  
    
    if (hits.length === 0) {
      hideLoader();
      hideLoadMore()
      iziToast.info({
        position: 'bottomCenter',
        message: "We're sorry, but there are no results matching your search criteria.",
      });
    } else {
    const renderImg = hits.reduce((html, hit) => {
      return (
        html +
            `<li class="gallery-item">
                <a href=${hit.largeImageURL}>
                <img src=${hit.webformatURL} class="foto" alt=${hit.tags}/>
                </a>
                <div class="benefits">
                <div class="benefit-text">
                <span class="text-value">Likes</span><p class="number">${hit.likes}</p></div>
                <div class="benefit-text">
                <span class="text-value">Views</span><p class="number">${hit.views}</p></div>
                <div class="benefit-text">
                <span class="text-value">Comments</span><p class="number">${hit.comments}</p></div>
                <div class="benefit-text">
                <span class="text-value">Downloads</span><p class="number">${hit.downloads}</p></div>
                </div>
            </li>`
            );
        }, "");
    gallery.innerHTML += renderImg;

    const lightbox = new SimpleLightbox('.gallery a', {
      nav: true,
      captionDelay: 250,
      captionData: 'alt',
      close: true,
      enableKeyboard: true,
      docClose: true,
  });

  lightbox.refresh();
  
  if (gallery.querySelector('.gallery-item')) {
    const cardHeight = gallery.querySelector('.gallery-item').getBoundingClientRect().height;

    if (hits.length < per_page || page * per_page >= totalHits) {
      hideLoader();
      hideLoadMore();
      iziToast.info({
        position: 'bottomCenter',
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      hideLoader();
      showLoadMore();
      const scrollDistance = 2 * cardHeight;
      window.scrollBy({
        top: scrollDistance,
        behavior: 'smooth',
      });
    }
  }
 }
} catch (error) {
  hideLoader();
  iziToast.error({
    position: 'bottomCenter',
    message: error.message,
  });
 }
  }

function showLoader() {
const loader = document.querySelector('.loader');
if (loader) {
  loader.style.display = 'block';
}
}

function hideLoader() {
const loader = document.querySelector('.loader');
if (loader) {
  loader.style.display = 'none';
}
}

function showLoadMore() {
const loadMore = document.querySelector('.btn-load-more');
if (loadMore) {
  loadMore.style.display = 'block';
}
}

function hideLoadMore() {
const loadMore = document.querySelector('.btn-load-more');
if (loadMore) {
  loadMore.style.display = 'none';
}
}

