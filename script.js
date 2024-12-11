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

// Navigation Functions
function showMainScreen() {
  mainScreen.style.display = "block";
  addCustomerScreen.style.display = "none";
  showCustomersScreen.style.display = "none";
}

function showChecklistScreen(customerId, customer) {
  console.log("Show checklist for:", customerId, customer);
}

// Initialize Modules
addCustomer(db, form, showMainScreen);
loadCustomers(db, customerList, showChecklistScreen);


//git add .   
//git commit -m "New Message"
//git push origin main  