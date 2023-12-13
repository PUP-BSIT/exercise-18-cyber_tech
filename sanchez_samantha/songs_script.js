// Function to fetch and display the list of songs
function displaySongs() {
    fetch('api.php', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('songTable');
        table.innerHTML = '';  

        const headerRow = table.insertRow(0);
        headerRow.innerHTML = `
            <th>ID</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Release Date</th>
            <th>Genre</th>
            <th>Action</th>
        `;

        data.forEach((song, index) => {
            const row = table.insertRow(index + 1);
            row.innerHTML = `
            <td>${song.id}</td>
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.release_year}</td>
            <td>${song.genre}</td>
            <td>
              <button onclick="updateSong(${song.id})">Update</button>
              <button onclick="deleteSong(${song.id})">Delete</button>
            </td>
          `;
        });        
    })
    .catch(error => {
        console.error('Error in catch block:', error.message);
    });
}

function addSong() {
    const form = document.getElementById('songForm');
    const formData = new FormData(form);

    fetch('api.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Song added successfully:', data);
        displaySongs(); 
    })
    .catch(error => {
        console.error('Error in catch block:', error.message);
    });
}

function updateSong(songId) {
    const form = document.getElementById('songForm');
    const formData = new FormData(form);

    const urlEncodedData = new URLSearchParams(formData).toString();

    fetch(`api.php?id=${songId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Song updated successfully:', data);
        displaySongs(); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteSong(songId) {
    fetch(`api.php?id=${songId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Song deleted successfully:', data);
        displaySongs(); 
    })
    .catch(error => {
        console.error('Error in catch block:', error);
    });
}

displaySongs();