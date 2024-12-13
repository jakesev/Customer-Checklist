import { ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

export function handleAddCustomer(db, form) {
  const toast = document.getElementById("toast");
  const errorAlert = document.getElementById("error-alert"); // Error alert element

  const showErrorAlert = (message) => {
    errorAlert.textContent = message;
    errorAlert.classList.add("show");
    setTimeout(() => {
      errorAlert.classList.remove("show");
    }, 3000); // Fade out after 3 seconds
  };

  const showToast = (orderNumber) => {
    const orderNumberSpan = document.getElementById("order-number");
    orderNumberSpan.textContent = orderNumber;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const number = document.getElementById("number").value.trim();
    const measureDate = document.getElementById("measure-date").value;
    const address = document.getElementById("address").value.trim();
    const status = document.getElementById("status").value;

    if (!status) {
      showErrorAlert("Please select a status.");
      return;
    }

    try {
      const customersRef = ref(db, "customers");

      // Fetch current customers from Firebase
      const customers = await new Promise((resolve) => {
        onValue(
          customersRef,
          (snapshot) => {
            resolve(snapshot.val());
          },
          { onlyOnce: true }
        );
      });

      let duplicateCustomer = null;

      if (customers) {
        // Check for duplicate customers
        Object.values(customers).forEach((customer) => {
          if (customer.name === name && customer.email === email) {
            duplicateCustomer = customer;
          }
        });
      }

      if (duplicateCustomer) {
        // Show error alert for duplicate
        showErrorAlert("This customer already exists. It is a duplicate record.");
        return;
      }

      // Add new customer if no duplicates found
      const newCustomerRef = push(customersRef);
      await set(newCustomerRef, {
        name,
        email,
        number,
        measureDate,
        address,
        status,
        createdAt: new Date().toISOString(),
        duplicateCount: 1, // Initialize duplicateCount for new customers
      });

      showToast(1); // Show success toast
      form.reset(); // Clear form fields
    } catch (error) {
      console.error("Error adding customer:", error);
      showErrorAlert("Failed to add customer. Please try again.");
    }
  });
}
