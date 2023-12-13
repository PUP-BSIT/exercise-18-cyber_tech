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

// Countries
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

// Destinations
function goToDestinationPage() {
  window.location.href = "travel_destinations.html";
}

let currentUpdateId = null;
const backendUrl = "https://cybertechlogistic.online/exercise_18/destinations.php";

function createTravelDestination() {
  const formData = new FormData(document.getElementById('create_form'));

  fetch(backendUrl, {
    method: 'POST',
    body: formData
  })

  .then(response => response.json())
  .then(data => {
    console.log('Response from server:', data); 
    if (data.status === 'success' && data.data && data.data.length > 0) {
    console.log('success: ', data.message);

      const destination = data.data[0];
      console.log('Destination:', destination); 

      updatedNameInput.value = destination.name;
      updatedLocationInput.value = destination.location;
      updatedDescriptionInput.value = destination.description;
      updatedRatingInput.value = destination.rating;
      updatedPopularAttractionsInput.value = destination.popular_attractions;

      updateForm.style.display = 'block';

      fetchTravelDestinations();
    } else {
        console.error('Error:', data.message);
        alert('Error fetching destination details. Please try again.');
    }
  })
  .catch((error) => {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again later.');
  });
}

function fetchTravelDestinations() {
  fetch(backendUrl, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      displayTravelDestinations(data.data);
    } else {
      console.error('Error:', data.message);
    }
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

function displayTravelDestinations(destinations) {
  const destinationList = document.getElementById('destination_list');
  destinationList.innerHTML = ''; 

  const tableHeader = document.createElement('tr');
  tableHeader.innerHTML = `
    <th>Name</th>
    <th>Location</th>
    <th>Description</th>
    <th>Rating</th>
    <th>Popular Attractions</th>
    <th>Actions</th>
  `;
  destinationList.appendChild(tableHeader);

  destinations.forEach(destination => {
    const tableRow = document.createElement('tr');

    tableRow.innerHTML = `
      <td>${destination.name}</td>
      <td>${destination.location}</td>
      <td>${destination.description}</td>
      <td>${destination.rating}</td>
      <td>${destination.popular_attractions}</td>
      <td>
        <button onclick="updateTravelDestination(${destination.id})">
          Update
        </button>
        <button onclick="deleteTravelDestination(${destination.id})">
          Delete
        </button>
      </td>
    `;

    destinationList.appendChild(tableRow);
  });
}

function updateTravelDestination(id) {
  const updateForm = 
    document.getElementById('update_form');
  const updatedNameInput = 
    document.getElementById('update_name');
  const updatedLocationInput = 
    document.getElementById('update_location');
  const updatedDescriptionInput = 
    document.getElementById('update_description');
  const updatedRatingInput = 
    document.getElementById('update_rating');
  const updatedPopularAttractionsInput = 
    document.getElementById('update_popular_attractions');

  fetch(`${backendUrl}?id=${id}`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success' && data.data.length > 0) {
      const destination = data.data[0];

        updatedNameInput.value = destination.name;
        updatedLocationInput.value = destination.location;
        updatedDescriptionInput.value = destination.description;
        updatedRatingInput.value = destination.rating;
        updatedPopularAttractionsInput.value = destination.popular_attractions;

        updateForm.style.display = 'block';

    } else {
        console.error('Error:', data.message);
        alert('Error fetching destination details. Please try again.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('An unexpected error occurred. Please try again later.');
  });

  updateForm.onsubmit = function (event) {
  event.preventDefault();

    if (!updatedNameInput.value || 
        !updatedLocationInput.value || 
        !updatedDescriptionInput.value || 
        !updatedRatingInput.value || 
        !updatedPopularAttractionsInput.value) {
      alert("All fields are required!");
      return;
    }

  const updatedData = {
    id: id, 
    name: updatedNameInput.value,
    location: updatedLocationInput.value,
    description: updatedDescriptionInput.value,
    rating: updatedRatingInput.value,
    popularAttractions: updatedPopularAttractionsInput.value
  };

  fetch(backendUrl, {
    method: 'PATCH',
    body: JSON.stringify(updatedData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
      return response.json();
  })
  .then(data => {
    if (data.status === 'success') {
      console.log('Success:', data.message);
      alert('Details have been successfully updated.');
      
      fetchTravelDestinations(); 
      updateForm.style.display = 'none';
    } else {
      console.error('Error:', data.message);
      alert('Error updating details. Please try again.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('An unexpected error occurred. Please try again later.');
  });
  };
}

function deleteTravelDestination(id) {
  fetch(`${backendUrl}?id=${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      console.log('Success:', data.message);          
      fetchTravelDestinations(); 
    } else {
        console.error('Error:', data.message);
    }
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

document.addEventListener('DOMContentLoaded', fetchTravelDestinations);