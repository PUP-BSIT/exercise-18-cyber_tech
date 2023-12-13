const apiBaseUrl = "https://cybertechlogistic.online/exercise_18/manzanas_api.php";

function createActionButton(type, userId) {
  const button = document.createElement("button");
  button.innerHTML = type;
  button.onclick = function () {
    if (type === "Edit") {
      showUpdateForm(userId);
    } else if (type === "Delete") {
      deleteRow(userId);
    }
  };
  return button;
}

function appendUserRow(user) {
  const table = document.querySelector("#animal_list");
  const row = table.insertRow(-1);
  const cellId = row.insertCell(0);
  const cellSpecies = row.insertCell(1);
  const cellClass = row.insertCell(2);
  const cellName = row.insertCell(3);
  const cellAge = row.insertCell(4);
  const cellHabitat = row.insertCell(5);
  const cellAction = row.insertCell(6);

  cellId.innerHTML = user.id;
  cellSpecies.innerHTML = user.species;
  cellClass.innerHTML = user.class;
  cellName.innerHTML = user.name;
  cellAge.innerHTML = user.age;
  cellHabitat.innerHTML = user.habitat;

  const editButton = createActionButton("Edit", user.id);
  const deleteButton = createActionButton("Delete", user.id);

  cellAction.appendChild(editButton);
  cellAction.appendChild(deleteButton);
}

function submitUser() {
  const species = document.querySelector("#species").value;
  const classValue = document.querySelector("#class").value;
  const name = document.querySelector("#name").value;
  const age = document.querySelector("#age").value;
  const habitat = document.querySelector("#habitat").value;

  fetch(apiBaseUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `species=${species}&class=${classValue}&name=${name}&age=${age}
    &habitat=${habitat}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert(data.message);
        document.querySelector("#species").value = "";
        document.querySelector("#class").value = "";
        document.querySelector("#name").value = "";
        document.querySelector("#age").value = "";
        document.querySelector("#habitat").value = "";
        refresh();
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function showUpdateForm(userId) {
  const form = document.querySelector("form");
  form.style.display = "none";
  const updateForm = document.querySelector("#update_form");
  updateForm.style.display = "block";

  fetch(`${apiBaseUrl}?id=${userId}`)
    .then(response => response.json())
    .then(userData => {
      for (const key in userData) {
        const element = document.querySelector(`#update_${key}`);
        if (element) {
          if (element.type === "checkbox") {
            element.checked = userData[key];
          } else {
            element.value = userData[key];
          }
        }
      }
    });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  updateForm.setAttribute("data-user-id", userId);
}

function submitUpdate() {
  const species = document.querySelector("#update_species").value;
  const classValue = document.querySelector("#update_class").value;
  const name = document.querySelector("#update_name").value;
  const age = document.querySelector("#update_age").value;
  const habitat = document.querySelector("#update_habitat").value;
  const userId = document.querySelector("#update_form")
    .getAttribute("data-user-id");

  fetch(apiBaseUrl, {
    method: "PATCH",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `id=${userId}&species=${species}&class=${classValue}&name=${name}
    &age=${age}&habitat=${habitat}`,
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);

      document.querySelector("#update_form").style.display = "none";
      document.querySelector("form").style.display = "block";

      refresh();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function refresh() {
  const table = document.querySelector("#animal_list");
  table.innerHTML = `<tr>
    <th>Animal ID</th>
    <th>Species</th>
    <th>Class</th>
    <th>Name</th>
    <th>Age</th>
    <th>Habitat</th>
    <th>Action</th>
  </tr>`;

  fetch(apiBaseUrl)
    .then((response) => response.json())
    .then((userList) => {
      for (const user of userList) {
        appendUserRow(user);
      }
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
}

function deleteRow(userId) {
  fetch(apiBaseUrl, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    body: `id=${userId}`,
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      refresh();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

refresh();
