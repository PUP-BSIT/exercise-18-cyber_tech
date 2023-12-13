async function searchCountries() {
  const searchInput = document.getElementById('search_input');
  const resultsContainer = document.getElementById('results_container');

  // Clear previous results
  resultsContainer.innerHTML = '';

  try {
    // First request to get details of the entered country
    const response = 
      await fetch(`https://restcountries.com/v3.1/name/${searchInput.value}`);
    const countryData = await response.json();

    if (!countryData.length) {
      throw new Error('Country not found');
    }

    const country = countryData[0];
    const region = country.region;

    // Display details of the entered country
    const countryCard = createCountryCard(country);
    resultsContainer.appendChild(countryCard);

    // Second request to get other countries in the same region
    const regionResponse = 
      await fetch(`https://restcountries.com/v3.1/region/${region}`);
    const regionCountries = await regionResponse.json();

    // Display other countries in the same region
    const regionTitle = document.createElement('div');
    regionTitle.className = 'regionTitle';
    regionTitle.textContent = `Other countries in the region (${region}):`;
    resultsContainer.appendChild(regionTitle);

    regionCountries.forEach(regionCountry => {
      if (regionCountry.name.common !== country.name.common) {
        const regionCountryCard = createCountryCard(regionCountry);
        resultsContainer.appendChild(regionCountryCard);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function createCountryCard(country) {
  const countryCard = document.createElement('div');
  countryCard.className = 'countryCard';

  const name = document.createElement('h2');
  name.textContent = country.name.common;
  countryCard.appendChild(name);

  const details = document.createElement('ul');
  details.innerHTML = `
    <li>Capital: ${country.capital}</li>
    <li>Population: ${country.population.toLocaleString()}</li>
    <li>Area: ${country.area.toLocaleString()} sq km</li>
    <li>Region: ${country.region}</li>
    <li>Subregion: ${country.subregion}</li>
  `;
  countryCard.appendChild(details);

  return countryCard;
}
