import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

export function loadCustomers(db, customerTableBody, showChecklistScreen) {
    const customersRef = ref(db, "customers");
  
    onValue(customersRef, (snapshot) => {
      customerTableBody.innerHTML = ""; // Clear existing table rows
      const customers = snapshot.val();
  
      if (customers) {
        Object.entries(customers).forEach(([key, customer]) => {
          const row = document.createElement("tr");
  
          // Name Column
          const nameCell = document.createElement("td");
          nameCell.textContent = customer.name || "Unknown";
          row.appendChild(nameCell);
  
          // Email Column
          const emailCell = document.createElement("td");
          emailCell.textContent = customer.email || "Unknown";
          row.appendChild(emailCell);
  
          // Number Column
          const numberCell = document.createElement("td");
          numberCell.textContent = customer.number || "Unknown";
          row.appendChild(numberCell);
  
          // Initial Quote Date Column
          const initialQuoteDateCell = document.createElement("td");
          initialQuoteDateCell.textContent = customer.initialQuoteDate || "Unknown";
          row.appendChild(initialQuoteDateCell);
  
          // Address Column
          const addressCell = document.createElement("td");
          addressCell.textContent = customer.address || "Unknown";
          row.appendChild(addressCell);
  
          // Actions Column
          const actionCell = document.createElement("td");
          const viewChecklistButton = document.createElement("button");
          viewChecklistButton.textContent = "View Checklist";
          viewChecklistButton.addEventListener("click", () =>
            showChecklistScreen(key, customer)
          );
          actionCell.appendChild(viewChecklistButton);
          row.appendChild(actionCell);
  
          customerTableBody.appendChild(row);
        });
      } else {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = 6;
        emptyCell.textContent = "No customers available.";
        emptyRow.appendChild(emptyCell);
        customerTableBody.appendChild(emptyRow);
      }
    });
  }
  
