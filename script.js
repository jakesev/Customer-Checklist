import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { addCustomer } from "./addCustomer.js";
import { loadCustomers } from "./displayCustomers.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  databaseURL: "your-database-url",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
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