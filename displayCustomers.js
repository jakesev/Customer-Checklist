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
  let currentEditRow = null; // Track the currently edited row

  // Utility function to format the date
  function formatDate(dateString) {
    if (!dateString) return "N/A"; // Handle missing dates
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  // Function to show the alert message
  function showEditAlert(message) {
    const editAlert = document.getElementById("edit-alert");
    editAlert.textContent = message;
    editAlert.classList.add("show");

    setTimeout(() => {
      editAlert.classList.remove("show");
    }, 3000); // Hide the alert after 3 seconds
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

      // Add Actions Column with Edit Button
      const actionsTd = document.createElement("td");
      const editButton = createEditButton(customer, actionsTd, row);
      actionsTd.appendChild(editButton);
      row.appendChild(actionsTd);

      tableBody.appendChild(row);
    });
  }

  // Function to create an Edit button
  function createEditButton(customer, cell, row) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "action-btn edit";

    // Click event to replace Edit button with Save and Cancel
    editButton.addEventListener("click", () => {
      if (currentEditRow) {
        showEditAlert("Please finalize the current edit to continue."); // Show alert
        return;
      }

      currentEditRow = row; // Set the current row being edited
      backToViewFromTable.disabled = true; // Disable the back button
      backToViewFromTable.classList.add("disabled"); // Add a disabled style (optional)

      const saveButton = createSaveButton(customer, cell);
      const cancelButton = createCancelButton(cell);

      // Clear the cell and add Save/Cancel buttons
      cell.innerHTML = "";
      cell.appendChild(saveButton);
      cell.appendChild(cancelButton);
    });

    return editButton;
  }

  // Function to create a Save button
  function createSaveButton(customer, cell) {
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.className = "action-btn save";

    saveButton.addEventListener("click", () => {
      // Logic for saving changes (if applicable)
      console.log(`Saving customer: ${customer.name}`);

      // Revert back to Edit button
      cell.innerHTML = "";
      const editButton = createEditButton(customer, cell, currentEditRow);
      cell.appendChild(editButton);

      currentEditRow = null; // Clear the current edit row
      backToViewFromTable.disabled = false; // Enable the back button
      backToViewFromTable.classList.remove("disabled"); // Remove the disabled style
    });

    return saveButton;
  }

  // Function to create a Cancel button
  function createCancelButton(cell) {
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className = "action-btn cancel";

    cancelButton.addEventListener("click", () => {
      console.log("Edit cancelled");

      // Revert back to Edit button without making changes
      cell.innerHTML = "";
      const editButton = createEditButton(null, cell, currentEditRow);
      cell.appendChild(editButton);

      currentEditRow = null; // Clear the current edit row
      backToViewFromTable.disabled = false; // Enable the back button
      backToViewFromTable.classList.remove("disabled"); // Remove the disabled style
    });

    return cancelButton;
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

  // Function to show the table screen
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
          sortData(dbField, true); // Sort ascending on click
        }
      });

      tableHeaders.appendChild(th);
    });

    // Add "Actions" column header
    const actionsTh = document.createElement("th");
    actionsTh.textContent = "Actions";
    tableHeaders.appendChild(actionsTh);

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

  // Back to View Customers Screen
  backToViewFromTable.addEventListener("click", (e) => {
    if (currentEditRow) {
      e.preventDefault(); // Prevent default back navigation
      showEditAlert("Please save or cancel your edits before going back."); // Show alert
      return;
    }
    customersTableScreen.style.display = "none";
    viewCustomersScreen.style.display = "block";
  });

  // Button Event Listeners
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
