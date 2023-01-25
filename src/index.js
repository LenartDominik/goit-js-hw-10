import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
var debounce = require('lodash.debounce');

import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

Notify.init({ position: 'center-top' });

const clearResult = () => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

const printDetailed = data => {
  const country = data[0];
  const languages = Object.values(country.languages);
  let languagesToPrint = '';
  if (languages.length === 1) {
    languagesToPrint = `<span class="highlight">Language:</span> ${languages}`;
  } else {
    languagesToPrint = `<span class="highlight">Languages:</span> ${languages.join(
      ', '
    )}`;
  }
  countryInfo.innerHTML = `<div class="country-heading">
        <img src="${country.flags.svg}" />
        <p>${country.name.common}</p>
      </div>
      <ul class="country-info-list">
        <li class="country-info-item">
          <span class="highlight">Capital:</span> ${country.capital}
        </li>
        <li class="country-info-item">
          <span class="highlight">Population:</span> ${country.population}
        </li>
        <li class="country-info-item">
          ${languagesToPrint}
        </li>
      </ul>`;
};

const readInput = () => {
  if (input.value.trim() === '') {
    clearResult();
  } else {
    fetchCountries(input.value.trim())
      .then(data => {
        if (data.length > 10) {
          clearResult();
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length > 1) {
          clearResult();
          const list = data
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .map(
              el =>
                `<li class="country-item"><img src=${el.flags.svg} /> <p>${el.name.common}</p></li>`
            )
            .join('\n');
          countryList.innerHTML = list;
        } else {
          clearResult();
          printDetailed(data);
        }
      })
      .catch(() => Notify.failure('Oops, there is no country with that name'));
  }
};

input.addEventListener('input', debounce(readInput, DEBOUNCE_DELAY));
