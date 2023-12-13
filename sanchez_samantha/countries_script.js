const getElement = (id) => document.getElementById(id);
const countryNameInput = getElement("country_name_input");
const searchButton = getElement("search_country_button");
const countryDetailsContainer = getElement("country_details");
const regionCountriesContainer = getElement("region_countries");

updateSearchButton();

countryNameInput.addEventListener("input", updateSearchButton);
searchButton.addEventListener("click", searchCountry);

async function searchCountry() {
    try {
        const countryName = countryNameInput.value.trim();
        if (!countryName) return;

        const countryDetailsResponse = await fetch
            (`https://restcountries.com/v3.1/name/${countryName}`);
        const countryDetailsData = await countryDetailsResponse.json();
        const region = countryDetailsData[0]?.region;

        displayCountryDetails(countryDetailsData[0]);

        const regionCountriesResponse = await fetch
            (`https://restcountries.com/v3.1/region/${region}`);
        const regionCountriesData = await regionCountriesResponse.json();

        displayRegionCountries(regionCountriesData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateSearchButton() {
    searchButton.disabled = !countryNameInput.value.trim();
}

function displayCountryDetails(country) {
    countryDetailsContainer.innerHTML = `
        <h3>${country.name.common}</h3>
        <p>Capital: ${country.capital}</p>
        <p>Population: ${country.population}</p>
        <p>Area: ${country.area} square kilometers</p>
        <p>Region: ${country.region}</p>
        <p>Subregion: ${country.subregion}</p>
    `;
}

function displayRegionCountries(countries) {
    regionCountriesContainer.innerHTML = `
        <h3>Other Countries in the Same Region</h3>
        <ul>
            ${countries.map(country => 
                `<li>${country.name.common}</li>`).join('')}
        </ul>
    `;
}
