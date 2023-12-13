let commentForm = document.getElementById("comment_form");
let nameInput = document.getElementById("name_comment");
let commentInput = document.getElementById("comment");
let commentsList = document.getElementById("comments_list");
let addCommentButton = document.getElementById("add_comment");

const toggleButtonState = () => {
  if (nameInput.value.trim() && commentInput.value.trim()) {
    addCommentButton.disabled = false;
  } else {
    addCommentButton.disabled = true;
  }
};

nameInput.addEventListener("input", toggleButtonState);
commentInput.addEventListener("input", toggleButtonState);

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let name_c = nameInput.value;
  let comment = commentInput.value;

  if (name_c && comment) {
    let newComment = document.createElement("li");
    newComment.textContent = `${name_c}: ${comment}`;
    newComment.dataset.date = new Date().getTime();

    commentsList.appendChild(newComment);

    sortComments();

    nameInput.value = "";
    commentInput.value = "";
    addCommentButton.disabled = true;
  }
});

function sortComments() {
  let allComments = Array.from(commentsList.children);

  allComments.sort((a, b) => {
    let dateA = parseInt(a.dataset.date);
    let dateB = parseInt(b.dataset.date);
    return dateA - dateB;
  });

  allComments.forEach((comment) => {
    commentsList.appendChild(comment);
  });
}

document.getElementById("sort_asc").addEventListener("click", sortComments);

document.getElementById("sort_desc").addEventListener("click", () => {
  let allComments = Array.from(commentsList.children);

  allComments.sort((a, b) => {
    let dateA = parseInt(a.dataset.date);
    let dateB = parseInt(b.dataset.date);
    return dateB - dateA;
  });

  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }

  allComments.forEach((comment) => {
    commentsList.appendChild(comment);
  });
});
function searchCountry() {
  const input = document.getElementById("country_input").value.trim();

  if (input !== "") {
    fetchCountry(input);
  } else {
    alert("Please enter a country name.");
  }
}


function fetchCountry(input) {
  fetch(`https://restcountries.com/v3.1/name/${input}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Country not found. Please try again.");
      }
      return response.json();
    })
    .then((countryData) => {
      if (countryData.length > 0) {
        const country = countryData[0];
        const region = country.region;

        displayCountryDetails(country);
        fetchCountriesInSameRegion(region, input);
      } else {
        throw new Error("Country not found. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
      alert(error.message);
    });
}

function displayCountryDetails(country) {
  const countryDetailsDiv = document.getElementById("countryDetails");
  countryDetailsDiv.innerHTML = `<h2>${country.name.common}</h2>
      <p>Capital: ${country.capital}</p>
      <p>Population: ${country.population}</p>
      <p>Area: ${country.area} km<sup>2</sup></p>
      <p>Region: ${country.region}</p>
      <p>Subregion: ${country.subregion}</p>`;
}

function fetchCountriesInSameRegion(region, excludedCountry) {
  fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching region data.");
      }
      return response.json();
    })
    .then((regionData) => {
      displayCountriesInSameRegion(regionData, excludedCountry);
    })
    .catch((error) => {
      console.error("Error:", error.message);
      alert(error.message);
    });
}

function displayCountriesInSameRegion(countries, excludedCountry) {
  const sameRegionDiv = document.getElementById("sameRegion");
  if (countries.length > 0) {
    let countriesHTML = "<ul>";
    countries.forEach((country) => {
      if (country.name.common !== excludedCountry) {
        countriesHTML += `<li>${country.name.common}</li>`;
      }
    });
    countriesHTML += "</ul>";
    sameRegionDiv.innerHTML = countriesHTML;
  } else {
    sameRegionDiv.innerHTML = "No countries found in this region.";
  }
}

const backUrl = "http://cybertechlogistic.online/exercise_18/malaluan_backend.php";

function fetchKpopIdols() {
    fetch(backUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("idol_table");
      tableBody.innerHTML = "";

      data.forEach((idol) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${idol.name}</td>
        <td>${idol.group_name}</td>
        <td>${idol.birthdate}</td>
        <td>${idol.position}</td>
        <td>
          <button onclick="editIdol(${idol.id})">Edit</button>
          <button onclick="deleteIdol(${idol.id})">Delete</button>
        </td>
      `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.getElementById("idol_form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const groupName = document.getElementById("group_name").value;
    const birthdate = document.getElementById("birthdate").value;
    const position = document.getElementById("position").value;

    const newIdolData = {
      name: name,
      group_name: groupName,
      birthdate: birthdate,
      position: position,
    };

    fetch(backUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newIdolData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.message);
        fetchKpopIdols();
        document.getElementById("idol_form").reset();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

function editIdol(id) {
  const newName = prompt("Enter new name:");
  const newGroupName = prompt("Enter new group name:");
  const newBirthdate = prompt("Enter new birthdate (YYYY-MM-DD):");
  const newPosition = prompt("Enter new position:");

  if (newName && newGroupName && newBirthdate && newPosition) {
    const updatedData = {
      id: id,
      name: newName,
      group_name: newGroupName,
      birthdate: newBirthdate,
      position: newPosition,
    };

      fetch(backUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        fetchKpopIdols();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("All fields are required!");
  }
}

function deleteIdol(id) {
  if (confirm("Are you sure you want to delete this idol?")) {
    const deleteData = { id: id };

      fetch(backUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        fetchKpopIdols();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

fetchKpopIdols();