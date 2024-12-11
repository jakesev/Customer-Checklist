import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { addCustomer } from "./addCustomer.js";
import { loadCustomers } from "./displayCustomers.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8CzhnwFAc2LnnO49xKrAti8eE-HTgs-U",
  authDomain: "customer-checklist.firebaseapp.com",
  databaseURL: "https://customer-checklist-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "customer-checklist",
  storageBucket: "customer-checklist.firebasestorage.app",
  messagingSenderId: "573424994833",
  appId: "1:573424994833:web:43f25adb3edfca693a7fb0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const form = document.getElementById("data-form");
const mainScreen = document.getElementById("main-screen");
const customerList = document.getElementById("customer-list");
const addCustomerScreen = document.getElementById("add-customer-screen");
const showCustomersScreen = document.getElementById("show-customers-screen");
const addCustomerButton = document.getElementById("add-customer-button");
const showCustomersButton = document.getElementById("show-customers-button");
const backToMainFromAdd = document.getElementById("back-to-main-from-add");
const backToMainFromShow = document.getElementById("back-to-main-from-show");

// Navigation Functions
function showMainScreen() {
  mainScreen.style.display = "block";
  addCustomerScreen.style.display = "none";
  showCustomersScreen.style.display = "none";
}

function showAddCustomerScreen() {
  mainScreen.style.display = "none";
  addCustomerScreen.style.display = "block";
  showCustomersScreen.style.display = "none";
}

function showShowCustomersScreen() {
  mainScreen.style.display = "none";
  addCustomerScreen.style.display = "none";
  showCustomersScreen.style.display = "block";
}

// Event Listeners for Navigation
addCustomerButton.addEventListener("click", showAddCustomerScreen);
showCustomersButton.addEventListener("click", showShowCustomersScreen);
backToMainFromAdd.addEventListener("click", showMainScreen);
backToMainFromShow.addEventListener("click", showMainScreen);

// Initialize Modules
document.addEventListener("DOMContentLoaded", () => {
  addCustomer(db, form, showMainScreen);
  loadCustomers(db, customerList, console.log);
});



//git add .   
//git commit -m "New Message"
//git push origin main  