import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

import { handleAddCustomer } from "./addCustomer.js";
import { handleViewCustomers } from "./displayCustomers.js"; // Import the view customers logic

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8CzhnwFAc2LnnO49xKrAti8eE-HTgs-U",
  authDomain: "customer-checklist.firebaseapp.com",
  databaseURL: "https://customer-checklist-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "customer-checklist",
  storageBucket: "customer-checklist.appspot.com",
  messagingSenderId: "573424994833",
  appId: "1:573424994833:web:43f25adb3edfca693a7fb0",
};

document.getElementById('data-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const number = document.getElementById('number').value;
  const measureDate = document.getElementById('measure-date').value;
  const address = document.getElementById('address').value;
  const status = document.getElementById('status').value;

  // Validate status
  if (!status) {
      alert("Please select a status!");
      return;
  }

  // Prepare the data object
  const customerData = {
      name,
      email,
      number,
      measureDate,
      address,
      status, // Add status to the database entry
  };

  console.log("Submitting Customer Data:", customerData);

  // Save to Firebase
  try {
      const customersRef = ref(db, 'customers');
      await push(customersRef, customerData);
  } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer.');
  }
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const mainScreen = document.getElementById("main-screen");
const addCustomerScreen = document.getElementById("add-customer-screen");
const viewCustomersScreen = document.getElementById("view-customers-screen");
const customersTableScreen = document.getElementById("customers-table-screen");

const addCustomerButton = document.getElementById("add-customer-button");
const viewCustomersButton = document.getElementById("placeholder-button");
const backToMainFromAdd = document.getElementById("back-to-main-from-add");
const backToMainFromView = document.getElementById("back-to-main-from-view");

// Navigation Functions
function showMainScreen() {
  [addCustomerScreen, viewCustomersScreen, customersTableScreen].forEach((screen) => {
    screen.style.display = "none"; // Hide all screens
  });
  mainScreen.style.display = "block"; // Show main screen
}

function showAddCustomerScreen() {
  mainScreen.style.display = "none"; // Hide main screen
  addCustomerScreen.style.display = "block"; // Show add customer screen
}

function showViewCustomersScreen() {
  mainScreen.style.display = "none"; // Hide main screen
  viewCustomersScreen.style.display = "block"; // Show view customers screen
}

// Event Listeners
addCustomerButton.addEventListener("click", showAddCustomerScreen);
viewCustomersButton.addEventListener("click", showViewCustomersScreen);
backToMainFromAdd.addEventListener("click", showMainScreen);
backToMainFromView.addEventListener("click", showMainScreen);

// Initialize Add Customer Functionality
handleAddCustomer(db, document.getElementById("data-form"), showMainScreen); // Add customer logic

// Initialize View Customers Functionality
handleViewCustomers(db); // View customers logic
