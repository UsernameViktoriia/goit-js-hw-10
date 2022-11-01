import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const ulEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(e => {
    infoEl.innerHTML = '';
    ulEl.innerHTML = '';
    const search = e.target.value.trim();
    if (!search) return;
    fetchCountries(search)
      .then(data => {
        if (data.length === 1) {
          appendMarkupInfo(data[0]);
        } else if (data.length <= 10 && data.length >= 2) {
          appendMarkupCountries(data);
        } else {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(data =>
        Notiflix.Notify.failure('Oops, there is no country with that name.')
      );
  }, DEBOUNCE_DELAY)
);

function appendMarkupInfo({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) {
  const markup = `
        <div class="wrapper">
        <img src = "${svg}" alt = "flag" width =40>
        <p>${official}</p>
        </div>
        <div class = "desc">
        <p>Capital: <span>${capital}</span></p>
        <p>Population: <span>${population}</span></p>
        <p>Languages: <span>${Object.values(languages)}</span></p>
        </div>
        
        `;

  infoEl.insertAdjacentHTML('beforeend', markup);
}
function appendMarkupCountries(data) {
  const markup = data
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `
        <li class='countries-item'>
        <img src = "${svg}" alt = "flag" width = 40>
        <p class='countries-title'>${official}</p>
        </li>
        `
    )
    .join('');
  ulEl.insertAdjacentHTML('beforeend', markup);
}
