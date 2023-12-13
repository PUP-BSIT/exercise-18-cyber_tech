let currentSortOrder = 'asc';

function onTextChange() {
  let myInput = document.getElementById("my_input");
  let name = document.getElementById("name");
  let submitButton = document.getElementById("submit_button");

  submitButton.disabled = !(myInput.value.trim() && name.value.trim());
}

function addComment() {
  let name = document.getElementById("name").value;
  let comment = document.getElementById("my_input").value;

  if (!name || !comment) return;

  let commentsList = document.getElementById("comments_list");
  let listItem = document.createElement("li");
  let paragraph = document.createElement("p");

  const currentDate = new Date();
  listItem.setAttribute("data-date", currentDate);
  paragraph.textContent = `${name}: ${comment}`;
  listItem.appendChild(paragraph);
  commentsList.appendChild(listItem);

  document.getElementById("name").value = "";
  document.getElementById("my_input").value = "";
  document.getElementById("submit_button").disabled = true;

  sortComments();
}

function formatDate(date) {
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-
  ${padZero(date.getDate())} ${padZero(date.getHours())}:
  ${padZero(date.getMinutes())}`;
}

function padZero(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

function sortComments(order) {
  let commentsList = document.getElementById("comments_list");
  let comments = Array.from(commentsList.children);

  if (order) {
    currentSortOrder = order === 'asc' ? 'asc' : 'desc';
  }

  comments.sort((a, b) => {
    let dateA = new Date(a.getAttribute("data-date"));
    let dateB = new Date(b.getAttribute("data-date"));

    return currentSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  commentsList.innerHTML = "";
  comments.forEach(comment => commentsList.appendChild(comment));

  console.log(`Comments sorted by date in ${currentSortOrder}ending order.`);
}

function goToCountryWebpage() {
  window.location.href="countries.html";
}

async function searchCountry() {
  const searchInput = document.getElementById('search_input').value;
  
  try {
    const countryResponse = await fetch(
      `https://restcountries.com/v3.1/name/${searchInput}`
    );
    const countryData = await countryResponse.json();

    const country = countryData[0];
    const region = country?.region;

    if (region) {
      const regionResponse = await fetch(
        `https://restcountries.com/v3.1/region/${region}`
      );
      const regionCountries = await regionResponse.json();

        displayCountryDetails(country);
        displayRegionCountries(regionCountries);
    } else {
        alert('Country not found.');
    }
  } catch (error) {
      console.error('Error fetching data:', error);
      alert('An error occurred while fetching data.');
  }
}

function displayCountryDetails(country) {
  const countryDetailsContainer = document.getElementById('country_details');
  countryDetailsContainer.innerHTML = 
    `<h2>${country.name.common}</h2>
    <p>Region: ${country.region}</p>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Area: ${country.area} km²</p>
    <p>Language: ${Object.values
    (country.languages).join(', ')}</p>`;
}

function displayRegionCountries(regionCountries) {
  const regionCountriesContainer = document.getElementById('region_countries');
  regionCountriesContainer.innerHTML = 
    `<p><strong>Countries in the same region:</strong></p>
    <ul>${regionCountries.map
    (country => `<li>${country.name.common}
    </li>`).join('')}</ul>`;
}