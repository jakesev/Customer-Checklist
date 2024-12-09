console.log("Script loaded successfully");

// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, push, get, update, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// DOM Elements
const mainScreen = document.getElementById('main-screen');
const addCustomerScreen = document.getElementById('add-customer-screen');
const showCustomersScreen = document.getElementById('show-customers-screen');
const customerList = document.getElementById('customer-list');
const form = document.getElementById('data-form');

// Navigation Buttons
const addCustomerButton = document.getElementById('add-customer-button');
const showCustomersButton = document.getElementById('show-customers-button');
const backToMainFromAdd = document.getElementById('back-to-main-from-add');
const backToMainFromShow = document.getElementById('back-to-main-from-show');

// Screen Navigation Functions
function showMainScreen() {
  mainScreen.style.display = 'block';
  addCustomerScreen.style.display = 'none';
  showCustomersScreen.style.display = 'none';
}

function showAddCustomerScreen() {
  mainScreen.style.display = 'none';
  addCustomerScreen.style.display = 'block';
  showCustomersScreen.style.display = 'none';
}

function showShowCustomersScreen() {
  mainScreen.style.display = 'none';
  addCustomerScreen.style.display = 'none';
  showCustomersScreen.style.display = 'block';
}

// Event Listeners for Navigation
addCustomerButton.addEventListener('click', showAddCustomerScreen);
showCustomersButton.addEventListener('click', showShowCustomersScreen);
backToMainFromAdd.addEventListener('click', showMainScreen);
backToMainFromShow.addEventListener('click', showMainScreen);

// Add Customer to Database
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  try {
    const customersRef = ref(db, 'customers'); // Reference to 'customers' node
    const newCustomerRef = push(customersRef); // Create a unique key
    await set(newCustomerRef, {
      name,
      email,
      status: 'Pending',
      checklist: {
        messaged: false,
        emailed: false,
        called: false,
      },
    });
    alert('Customer added successfully!');
    form.reset();
    showMainScreen(); // Go back to the main screen after adding
  } catch (error) {
    alert("Error: Failed to add customer.");
    console.error('Error adding customer:', error);
  }
});

// Load Customers and Show in List
function loadCustomers() {
  const customersRef = ref(db, 'customers');
  onValue(customersRef, (snapshot) => {
    customerList.innerHTML = ''; // Clear existing list
    const customers = snapshot.val();
    if (customers) {
      for (let key in customers) {
        const customer = customers[key];
        const li = document.createElement('li');
        li.textContent = `${customer.name} - ${customer.status}`;
        const viewChecklistButton = document.createElement('button');
        viewChecklistButton.textContent = 'View Checklist';
        viewChecklistButton.addEventListener('click', () => showChecklistScreen(key, customer));
        li.appendChild(viewChecklistButton);
        customerList.appendChild(li);
      }
    }
  });
}

// Show Checklist Screen
function showChecklistScreen(customerId, customer) {
  const checklistScreen = document.createElement('div');
  checklistScreen.classList.add('checklist-page'); // Add a class for styling
  checklistScreen.innerHTML = `
    <h2>Checklist for ${customer.name}</h2>
    <label><input type="checkbox" id="messaged" ${customer.checklist.messaged ? 'checked' : ''}> Check if messaged</label><br>
    <label><input type="checkbox" id="emailed" ${customer.checklist.emailed ? 'checked' : ''}> Check if emailed</label><br>
    <label><input type="checkbox" id="called" ${customer.checklist.called ? 'checked' : ''}> Check if called</label><br>
    <button id="save-checklist">Save</button>
    <button id="back-to-show-customers">Back</button>
  `;

  document.body.innerHTML = ''; // Clear the current content
  document.body.appendChild(checklistScreen);

  // Save Checklist
  document.getElementById('save-checklist').addEventListener('click', async () => {
    const messaged = document.getElementById('messaged').checked;
    const emailed = document.getElementById('emailed').checked;
    const called = document.getElementById('called').checked;

    const updatedChecklist = { messaged, emailed, called };
    const status =
      messaged && emailed && called ? 'Finished Checklist (Waiting Install)' : 'Sold';

    try {
      await update(ref(db, `customers/${customerId}`), {
        checklist: updatedChecklist,
        status,
      });
      alert('Checklist updated successfully!');
      showShowCustomersScreen(); // Return to the customer list
    } catch (error) {
      alert('Error updating checklist.');
      console.error('Error:', error);
    }
  });

  // Back to Customer List
  document.getElementById('main-screen').addEventListener('click', () => {
    document.body.innerHTML = ''; // Clear the checklist screen
    document.body.appendChild(showCustomersScreen);
    loadCustomers(); // Reload customer data
  });
}


// Load Customers on Show Customers Screen Load
backToMainFromShow.addEventListener('click', () => {
  showMainScreen(); // Return to the main screen
});

//git add .
//git commit -m "New Message"
//git push origin main
