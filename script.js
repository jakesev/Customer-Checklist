console.log("Script loaded successfully");

// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyA8CzhnwFAc2LnnO49xKrAti8eE-HTgs-U",
  authDomain: "customer-checklist.firebaseapp.com",
  databaseURL: "https://customer-checklist-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "customer-checklist",
  storageBucket: "customer-checklist.firebasestorage.app",
  messagingSenderId: "573424994833",
  appId: "1:573424994833:web:43f25adb3edfca693a7fb0",
};

// Initialize Firebase and Realtime Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM References
const statusDiv = document.getElementById('connection-status');
const form = document.getElementById('data-form');
const dataUl = document.getElementById('data-ul');

// Connection Status
try {
  const usersRef = ref(db, 'users');
  onValue(usersRef, () => {
    statusDiv.textContent = "Connected to Firebase Realtime Database successfully!";
    statusDiv.style.color = "green";
  });
} catch (error) {
  alert("Error: Failed to connect to Firebase.");
  statusDiv.textContent = "Error: Failed to connect to Firebase.";
  statusDiv.style.color = "red";
  console.error("Database connection error:", error);
}

// Add Data to Realtime Database
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  // Disable submit button to prevent multiple submissions
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const usersRef = ref(db, 'users'); // Reference to 'users' node
    const newUserRef = push(usersRef); // Create a unique key
    await set(newUserRef, { name, email });
    alert('Data submitted successfully!');
    loadData(); // Refresh the data list
  } catch (error) {
    alert("Error: Failed to add data to the database.");
    console.error('Error adding data:', error);
  }

  // Re-enable the submit button
  submitButton.disabled = false;
  form.reset();
});

// Load Data from Realtime Database
async function loadData() {
  const usersRef = ref(db, 'users');
  try {
    const snapshot = await get(usersRef); // Fetch data once
    dataUl.innerHTML = ''; // Clear existing data
    const data = snapshot.val();
    if (data) {
      for (let key in data) {
        const li = document.createElement('li');
        li.textContent = `${data[key].name} - ${data[key].email}`;
        dataUl.appendChild(li);
      }
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Initial Load
loadData();


//git add .
//git commit -m "New Message"
//git push origin main
