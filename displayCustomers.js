// DOM Elements
const mainScreen = document.getElementById("main-screen");
const viewCustomersScreen = document.getElementById("view-customers-screen");
const convertedCustomersTable = document.getElementById("converted-customers-table");

const btnViewCustomers = document.getElementById("view-customers-button"); // Add this in your main buttons
const btnFollowUp = document.getElementById("btn-follow-up");
const btnConverted = document.getElementById("btn-converted");
const btnCompleted = document.getElementById("btn-completed");
const btnLost = document.getElementById("btn-lost");

const backToMainFromView = document.getElementById("back-to-main-from-view");
const backToViewFromTable = document.getElementById("back-to-view-from-table");
const convertedCustomersBody = document.getElementById("converted-customers-body");

// Navigation Functions
function showViewCustomersScreen() {
  mainScreen.style.display = "none";
  viewCustomersScreen.style.display = "block";
}

function showConvertedCustomersTable() {
  viewCustomersScreen.style.display = "none";
  convertedCustomersTable.style.display = "block";

  // Populate the Converted Customers Table
  loadConvertedCustomers();
}

function backToView() {
  convertedCustomersTable.style.display = "none";
  viewCustomersScreen.style.display = "block";
}

function backToMain() {
  viewCustomersScreen.style.display = "none";
  mainScreen.style.display = "block";
}

// Event Listeners
btnViewCustomers.addEventListener("click", showViewCustomersScreen);
btnConverted.addEventListener("click", showConvertedCustomersTable);
backToViewFromTable.addEventListener("click", backToView);
backToMainFromView.addEventListener("click", backToMain);

// Fetch Converted Customers and Populate Table
function loadConvertedCustomers() {
  const customersRef = ref(db, "converted-customers"); // Example database path
  convertedCustomersBody.innerHTML = ""; // Clear existing rows

  onValue(customersRef, (snapshot) => {
    const customers = snapshot.val();

    if (customers) {
      Object.values(customers).forEach((customer) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${customer.name || "N/A"}</td>
          <td>${customer.email || "N/A"}</td>
          <td>${customer.number || "N/A"}</td>
          <td>${customer.measuredDate || "N/A"}</td>
          <td>${customer.checkMap || "N/A"}</td>
          <td>${customer.checkSupply || "N/A"}</td>
          <td>${customer.checkPickupLocation || "N/A"}</td>
          <td>${customer.pickupDate || "N/A"}</td>
          <td>${customer.checkInstaller || "N/A"}</td>
          <td>${customer.confirmedInstallDate || "N/A"}</td>
          <td>${customer.sale || "N/A"}</td>
          <td>${customer.cogs || "N/A"}</td>
          <td>${customer.estimatedProfit || "N/A"}</td>
          <td>${customer.completionDate || "N/A"}</td>
        `;

        convertedCustomersBody.appendChild(row);
      });
    } else {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="14">No converted customers available.</td>`;
      convertedCustomersBody.appendChild(emptyRow);
    }
  });
}
