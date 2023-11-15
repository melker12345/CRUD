let rawData = {}; // Variable to store raw JSON data
const apiUrl = "https://reqres.in/api/users/";
let isJsonView = false; // 

// Function to fetch users from the API
function fetchUsers() {
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            rawData = data; 
            renderUsers(); 
        })
        .catch((error) => console.error("Fetch error:", error));
}

// Function to render users
function renderUsers() {
    const usersDiv = document.getElementById("posts");
    usersDiv.innerHTML = ""; // Clear existing content

    // Loop through each user and create HTML for each user
    rawData.data.forEach((user) => {
        usersDiv.innerHTML += createUserHTML(user);
    }); 

    // Update localStorage with the current state of rawData
    localStorage.setItem("rawData", JSON.stringify(rawData));
}

// Function to toggle between JSON view and user view
function toggleView() {
    isJsonView = !isJsonView;
    document.getElementById("posts").style.display = isJsonView ? "none" : "block"; // Toggle display of the users view
    document.getElementById("jsonView").style.display = isJsonView ? "block" : "none"; // Toggle display of the JSON view
    
    // Update the JSON view with the current state of rawData
    if (isJsonView) {
        document.getElementById("jsonView").textContent = JSON.stringify(rawData, null, 2); 
    }
}

// Function to create HTML for a user
function createUserHTML(user) {
    return `
                <div id="user-${user.id}">
                    <h4>${user.first_name} ${user.last_name}</h4>
                    <p>${user.email}</p>
                    <button aria-label="Update user" onclick="updateUser(${user.id})">Update</button>
                    <button aria-label="Delete user" onclick="deleteUser(${user.id})">Delete</button>
                </div>
            `;
}


// POST request to create a new user
function createUser() {

    // Get values from input fields
    const name = document.getElementById("userName").value;
    const lastName = document.getElementById("userLastName").value;
    const email = document.getElementById("userEmail").value;

    // Check if any of the input fields are empty
    if (!name || !lastName || !email) {
        console.error("All fields are required");
        alert("Please fill in all fields");
        return;
    }

    // Validate the email format
    if (!email.includes("@") || !email.includes(".")) {
        console.error("Invalid email format");
        alert("Please enter a valid email address");
        return;
    }

    // Send POST request to create the user with the values of the input fields
    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            first_name: name,
            last_name: lastName,
            email: email,
        }),  
    }) 
        .then((response) => response.json())
        .then((user) => {
            console.log("Created user:", user);

            // Add the new user to rawData and update the views
            rawData.data.push({
                ...user,
                first_name: name,
                last_name: lastName,
                email: email,
            }); 
            renderUsers();

            // Update the JSON view 
            if (isJsonView) {
                document.getElementById("jsonView").textContent = JSON.stringify(rawData, null, 2);
            }
        }) 
        .catch((error) => {
            console.error("Error creating user:", error);
            alert("Failed to create user");
        });
}

// PATCH request to update a user
function updateUser(id) {

    // Get updated values from input fields 
    const newName = document.getElementById("userName").value;
    const newLastName = document.getElementById("userLastName").value;
    const newEmail = document.getElementById("userEmail").value;

    // Check if the input fields are not empty and validate the email format
    if (!newName || !newLastName || !newEmail) {
        alert("All fields are required for updating.");
        return;
    }

    if (!newEmail.includes("@") || !newEmail.includes(".")) {
        alert("Please enter a valid email address for updating.");
        return;
    }

    // Send PATCH request to update the user
    fetch(apiUrl + "/" + id, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: id,
            first_name: newName,
            last_name: newLastName,
            email: newEmail,
        }),
    })
        .then((response) => response.json())
        .then((updatedUser) => {
            console.log("Updated user:", updatedUser);

            // Update rawData with the new user details
            const userIndex = rawData.data.findIndex((user) => user.id === id);
            if (userIndex !== -1) {
                rawData.data[userIndex] = {
                    ...updatedUser,
                    first_name: newName,
                    last_name: newLastName,
                    email: newEmail,
                };
                
                renderUsers();

                // Update the JSON view 
                if (isJsonView) {
                    document.getElementById("jsonView").textContent = JSON.stringify(rawData, null, 2);
                }
            }
        })
        .catch((error) => console.error("Error updating user:", error));
}

// DELETE request to delete a user
function deleteUser(userId) {
    fetch(`${apiUrl}/${userId}`, { method: "DELETE" })
        .then((response) => {
            if (response.ok) {
                console.log("User deleted successfully");

                // Update rawData by removing the deleted user
                const numericId = +userId; 
                rawData.data = rawData.data.filter(
                    (user) => user.id !== numericId
                );  

                // Remove the users div
                const userDiv = document.getElementById(`user-${userId}`);
                if (userDiv) {
                    userDiv.remove();
                }

                // Update the view of the JSON data
                if (isJsonView) {
                    document.getElementById("jsonView").textContent = JSON.stringify(rawData, null, 2);
                } 

                renderUsers(); 
            
            } else {
                console.error("Deletion failed");
            }

        })
        .catch((error) => console.error("Error:", error));
}

fetchUsers();
