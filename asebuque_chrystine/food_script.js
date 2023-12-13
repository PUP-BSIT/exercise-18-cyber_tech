document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const categoryInput = document.getElementById("category");
    const descriptionInput = document.getElementById("description");
    const priceInput = document.getElementById("price");
    const availabilityInput = document.getElementById("availability");
    const submitButton = document.getElementById("submit_btn");
    const foodTable = document.getElementById("food_table");
    const foodList = document.getElementById("food_list");

    function refreshFoodList() {
        fetch("https://cybertechlogistic.online/exercise_18/asebuque_backend.php")            
            .then(response => response.json())
            .then(data => {
                foodList.innerHTML = "";
                data.forEach(food => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${food.name}</td>
                        <td>${food.category}</td>
                        <td>${food.description}</td>
                        <td>${food.price}</td>
                        <td>${food.availability}</td>
                        <td>
                            <button onclick="editFood(${food.id})">
                                Edit
                            </button>
                            <button onclick="deleteFood(${food.id})">
                                Delete
                            </button>
                        </td>
                    `;
                    foodList.appendChild(row);
                });
            });
    }

    function submitFood() {
        const name = nameInput.value.trim();
        const category = categoryInput.value;
        const description = descriptionInput.value.trim();
        const price = priceInput.value;
        const availability = availabilityInput.value;

        if (!name || !description || !price) {
            alert("Please fill in all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("availability", availability);

        fetch("https://cybertechlogistic.online/exercise_18/asebuque_backend.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                refreshFoodList();
            })
            .catch(error => console.error("Error submitting food:", error));
    }

    function editFood(id) {
        fetch(`https://cybertechlogistic.online/exercise_18/asebuque_backend.php?id=${id}`)
            .then(response => response.json())
            .then(food => {
                nameInput.value = food.name;
                categoryInput.value = food.category;
                descriptionInput.value = food.description;
                priceInput.value = food.price;
                availabilityInput.value = food.availability;
    
                submitButton.disabled = true;

                submitButton.textContent = "Update";
    
                submitButton.removeEventListener("click", submitFood);
                submitButton.addEventListener("click", () => updateFood(id));
            })
            .catch(error => console.error(
                "Error fetching food details:", error)
            );
    }

    function updateFood(id) {
        const name = nameInput.value.trim();
        const category = categoryInput.value;
        const description = descriptionInput.value.trim();
        const price = priceInput.value;
        const availability = availabilityInput.value;
    
        if (!name || !description || !price) {
            alert("Please fill in all required fields.");
            return;
        }
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("availability", availability);

        fetch(`https://cybertechlogistic.online/exercise_18/asebuque_backend.php?id=${id}`, {
            method: "PATCH",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                resetForm();
                refreshFoodList();
            })
            .catch(error => console.error("Error updating food:", error));
    }
    
    function resetForm() {
        nameInput.value = "";
        categoryInput.value = "appetizers";
        descriptionInput.value = "";
        priceInput.value = "";
        availabilityInput.value = "available";

        submitButton.textContent = "Add Food";

        submitButton.removeEventListener("click", updateFood);

        submitButton.addEventListener("click", submitFood);
    }

    function deleteFood(id) {
        fetch(`https://cybertechlogistic.online/exercise_18/asebuque_backend.php?id=${id}`, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                refreshFoodList();
            })
            .catch(error => console.error("Error deleting food:", error));
    }

    nameInput.addEventListener(
        "input", () => submitButton.disabled = !nameInput.value.trim()
    );
    submitButton.addEventListener("click", submitFood);

    refreshFoodList();
});