import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

export function loadCustomers(db, customerList, showChecklistScreen) {
  const customersRef = ref(db, "customers");

  onValue(customersRef, (snapshot) => {
    customerList.innerHTML = ""; // Clear existing list
    const customers = snapshot.val();

    if (customers) {
      Object.entries(customers).forEach(([key, customer]) => {
        const li = document.createElement("li");
        li.textContent = `${customer.name} - ${customer.status}`;
        const viewChecklistButton = document.createElement("button");
        viewChecklistButton.textContent = "View Checklist";
        viewChecklistButton.addEventListener("click", () =>
          showChecklistScreen(key, customer)
        );
        li.appendChild(viewChecklistButton);
        customerList.appendChild(li);
      });
    } else {
      customerList.innerHTML = "<li>No customers available.</li>";
    }
  });
}
