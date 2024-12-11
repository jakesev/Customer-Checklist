import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { handleAddCustomer } from "./addCustomer.js";


// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8CzhnwFAc2LnnO49xKrAti8e-HTgs-U",
  authDomain: "customer-checklist.firebaseapp.com",
  databaseURL: "https://customer-checklist-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "customer-checklist",
  storageBucket: "customer-checklist.appspot.com",
  messagingSenderId: "573424994833",
  appId: "1:573424994833:web:43f25adb3edfca693a7fb0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const mainScreen = document.getElementById("main-screen");
const addCustomerScreen = document.getElementById("add-customer-screen");
const addCustomerButton = document.getElementById("add-customer-button");
const backToMainFromAdd = document.getElementById("back-to-main-from-add");
const form = document.getElementById("data-form");

// Navigation Functions
function showAddCustomerScreen() {
  mainScreen.style.display = "none"; // Hide main screen
  addCustomerScreen.style.display = "block"; // Show add customer screen
}

function showMainScreen() {
  addCustomerScreen.style.display = "none"; // Hide add customer screen
  mainScreen.style.display = "block"; // Show main screen
}

// Event Listeners
addCustomerButton.addEventListener("click", showAddCustomerScreen);
backToMainFromAdd.addEventListener("click", showMainScreen);

// Initialize Add Customer Functionality
handleAddCustomer(db, form, showMainScreen); // Only call once
