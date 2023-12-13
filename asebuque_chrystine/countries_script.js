document.addEventListener("DOMContentLoaded", () => {
    const countryKeywordInput = document.getElementById("country_keyword");
    const searchButton = document.getElementById("search_button");
    const countryDetails = document.getElementById("country_details");
    const otherCountries = document.getElementById("other_countries");

    searchButton.addEventListener("click", searchCountry);

    function searchCountry() {
        const countryKeyword = countryKeywordInput.value.trim();

        if (countryKeyword === "") {
            alert("Please enter a country keyword.");
            return;
        }

        fetch(`https://restcountries.com/v3.1/name/${countryKeyword}`)
            .then(response => response.json())
            .then(data => {
                if (data[0] && data[0].region) {
                    const region = data[0].region;
                    const countryDetailsData = data[0];
                    displayCountryDetails(
                        countryKeyword, region, countryDetailsData);

                    fetch(`https://restcountries.com/v3.1/region/${region}`)
                        .then(response => response.json())
                        .then(otherCountriesData => {
                            displayOtherCountries(otherCountriesData);
                        })
                        .catch(error => console.error(
                            "Error fetching other countries:", error)
                        );
                } else {
                    alert("Country not found.");
                }
            })
            .catch(error => console.error(
                "Error fetching country details:", error)
            );
    }

    function displayCountryDetails(country, region, details) {
        const languages = details.languages
            ? Object.values(details.languages).join(", ")
            : "N/A";
    
        countryDetails.innerHTML = `
            <h2>${country}</h2>
            <p>Region: ${region}</p>
            <p>Capital: ${details.capital || "N/A"}</p>
            <p>Population: ${details.population || "N/A"}</p>
            <p>Area: ${details.area || "N/A"} square kilometers</p>
            <p>Languages: ${languages}</p>
        `;
    }

    function displayOtherCountries(countries) {
        otherCountries.innerHTML = "";
        countries.forEach(country => {
            const card = document.createElement("div");
            card.classList.add("country-card");

            const name = document.createElement("h3");
            name.textContent = country.name.common;

            card.appendChild(name);
            otherCountries.appendChild(card);
        });
    }
});