import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

export function handleViewCustomers(db) {
  // DOM Elements
  const viewCustomersScreen = document.getElementById("view-customers-screen");
  const customersTableScreen = document.getElementById("customers-table-screen");

  const btnFollowUp = document.getElementById("btn-follow-up");
  const btnConverted = document.getElementById("btn-converted");
  const btnCompleted = document.getElementById("btn-completed");
  const btnLost = document.getElementById("btn-lost");

  const backToViewFromTable = document.getElementById("back-to-view-from-table");

  const tableTitle = document.getElementById("table-title");
  const tableHeaders = document.getElementById("table-headers");
  const tableBody = document.getElementById("table-body");

  // Map field names to database keys
  const fieldMappings = {
    "Name": "name",
    "Email": "email",
    "Number": "number",
    "Measured Date": "measuredDate",
    "Check Map & Quote Supply": "checkMapAndQuoteSupply",
    "Check Supply": "checkSupply",
    "Check Supply Pickup Location": "checkSupplyPickupLocation",
    "Pickup Location Date": "pickupLocationDate",
    "Check Installer": "checkInstaller",
    "Confirmed Installation Date": "confirmedInstallationDate",
    "Sale": "sale",
    "COGS": "cogs",
    "Estimated Profit": "estimatedProfit",
    "Completion Date": "completionDate",
    "Reason": "reason",
  };

  const pathTitles = {
    "follow-up-customers": "Need to Follow Up Customers",
    "converted-customers": "Converted Customers",
    "completed-installations": "Completed Installations",
    "lost-customers": "Lost Customers",
  };

  // Show the table screen
  function showTableScreen(path, headers) {
    viewCustomersScreen.style.display = "none"; // Hide View Customers Screen
    customersTableScreen.style.display = "block"; // Show Table Screen

    tableTitle.textContent = pathTitles[path] || "Customers Table"; // Update title
    tableHeaders.innerHTML = ""; // Clear existing headers

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header; // Add header text
      tableHeaders.appendChild(th);
    });

    tableBody.innerHTML = ""; // Clear existing rows
    const customersRef = ref(db, path);

    onValue(customersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        Object.values(data).forEach((customer) => {
          const row = document.createElement("tr");
          headers.forEach((header) => {
            const dbField = fieldMappings[header]; // Map to database field
            const td = document.createElement("td");
            td.textContent = customer[dbField] || "N/A"; // Populate cell
            row.appendChild(td);
          });
          tableBody.appendChild(row); // Add row to table
        });
      } else {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td colspan="${headers.length}">No data available.</td>`;
        tableBody.appendChild(emptyRow);
      }
    });
  }

  // Back to View Customers Screen
  backToViewFromTable.addEventListener("click", () => {
    customersTableScreen.style.display = "none"; // Hide Table Screen
    viewCustomersScreen.style.display = "block"; // Show View Customers Screen
  });

  // Event Listeners for Buttons
  btnFollowUp.addEventListener("click", () =>
    showTableScreen("follow-up-customers", ["Name", "Email", "Number", "Measured Date"])
  );
  btnConverted.addEventListener("click", () =>
    showTableScreen("converted-customers", [
      "Name",
      "Email",
      "Number",
      "Measured Date",
      "Check Map & Quote Supply",
      "Check Supply",
      "Check Supply Pickup Location",
      "Pickup Location Date",
      "Check Installer",
      "Confirmed Installation Date",
      "Sale",
      "COGS",
      "Estimated Profit",
      "Completion Date",
    ])
  );
  btnCompleted.addEventListener("click", () =>
    showTableScreen("completed-installations", ["Name", "Email", "Completion Date"])
  );
  btnLost.addEventListener("click", () =>
    showTableScreen("lost-customers", ["Name", "Email", "Reason"])
  );
}
