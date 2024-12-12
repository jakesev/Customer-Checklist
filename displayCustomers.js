import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

export function handleViewCustomers(db) {
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

  const fieldMappings = {
    "Name": "name",
    "Email": "email",
    "Number": "number",
    "Measured Date": "measureDate",
  };

  const pathTitles = {
    "customers": "Need to Follow Up Customers",
    "converted-customers": "Converted Customers",
    "completed-installations": "Completed Installations",
    "lost-customers": "Lost Customers",
  };

  let currentData = []; // Store the currently loaded data for sorting

  // Utility function to format the date
  function formatDate(dateString) {
    if (!dateString) return "N/A"; // Handle missing dates
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  // Function to populate the table rows
  function populateTable(headers) {
    tableBody.innerHTML = ""; // Clear existing rows
    currentData.forEach((customer) => {
      const row = document.createElement("tr");
      headers.forEach((header) => {
        const dbField = fieldMappings[header];
        const td = document.createElement("td");
        if (dbField === "measureDate") {
          td.textContent = formatDate(customer[dbField]); // Format date before displaying
        } else {
          td.textContent = customer[dbField] || "N/A"; // Populate cell
        }
        row.appendChild(td);
      });
      tableBody.appendChild(row);
    });
  }

  // Function to sort data by a specific field
  function sortData(field, ascending = true) {
    currentData.sort((a, b) => {
      if (a[field] < b[field]) return ascending ? -1 : 1;
      if (a[field] > b[field]) return ascending ? 1 : -1;
      return 0;
    });
    populateTable(Object.keys(fieldMappings)); // Re-populate the table with sorted data
  }

  function showTableScreen(path, headers, filterFunction = null) {
    viewCustomersScreen.style.display = "none";
    customersTableScreen.style.display = "block";

    tableTitle.textContent = pathTitles[path] || "Customers Table";
    tableHeaders.innerHTML = ""; // Clear headers

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      th.style.cursor = "pointer"; // Indicate that the header is clickable for sorting

      // Add click event for sorting
      th.addEventListener("click", () => {
        const dbField = fieldMappings[header];
        if (dbField) {
          sortData(dbField, true); // Sort ascending on click (you can toggle between ascending/descending if needed)
        }
      });

      tableHeaders.appendChild(th);
    });

    currentData = []; // Reset current data
    const customersRef = ref(db, path);

    onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      currentData = []; // Clear current data
      if (data) {
        Object.values(data).forEach((customer) => {
          if (!filterFunction || filterFunction(customer)) {
            currentData.push(customer); // Add filtered customers to current data
          }
        });
      }
      populateTable(headers); // Populate the table with the current data
    });
  }

  backToViewFromTable.addEventListener("click", () => {
    customersTableScreen.style.display = "none";
    viewCustomersScreen.style.display = "block";
  });

  btnFollowUp.addEventListener("click", () =>
    showTableScreen(
      "customers",
      ["Name", "Email", "Number", "Measured Date"],
      (customer) => customer.status === "Pending"
    )
  );

  btnConverted.addEventListener("click", () =>
    showTableScreen("converted-customers", ["Name", "Email", "Number", "Measured Date"])
  );

  btnCompleted.addEventListener("click", () =>
    showTableScreen("completed-installations", ["Name", "Email", "Completion Date"])
  );

  btnLost.addEventListener("click", () =>
    showTableScreen("lost-customers", ["Name", "Email", "Reason"])
  );
}
