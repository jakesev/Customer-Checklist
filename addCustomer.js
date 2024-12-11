import { ref, onValue, push, set, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

export function handleAddCustomer(db, form) {
  // Modal Elements
  const modal = document.getElementById("custom-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const modalConfirm = document.getElementById("modal-confirm");
  const modalCancel = document.getElementById("modal-cancel");

  // Toast Elements
  const toast = document.getElementById("toast");
  const orderNumberSpan = document.getElementById("order-number");

  // Show Toast Notification
  const showToast = (orderNumber) => {
    orderNumberSpan.textContent = orderNumber;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000); // Hide toast after 3 seconds
  };

  // Show Modal Function
  const showModal = (title, message, onConfirm) => {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove("hidden");

    const confirmHandler = () => {
      onConfirm();
      hideModal();
    };

    modalConfirm.addEventListener("click", confirmHandler, { once: true });
    modalCancel.addEventListener("click", hideModal, { once: true });
  };

  // Hide Modal Function
  const hideModal = () => {
    modal.classList.add("hidden");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form reload

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const number = document.getElementById("number").value.trim();
    const measureDate = document.getElementById("measure-date").value;
    const address = document.getElementById("address").value.trim();

    try {
      const customersRef = ref(db, "customers");

      // Check for duplicate customer
      const customers = await new Promise((resolve) => {
        onValue(customersRef, (snapshot) => {
          resolve(snapshot.val());
        }, { onlyOnce: true });
      });

      let duplicateCustomerKey = null;
      let duplicateCustomer = null;

      if (customers) {
        Object.entries(customers).forEach(([key, customer]) => {
          if (customer.name === name && customer.email === email) {
            duplicateCustomerKey = key;
            duplicateCustomer = customer;
          }
        });
      }

      if (duplicateCustomer) {
        const duplicateCount = duplicateCustomer.duplicateCount || 1;

        showModal(
          "Duplicate Customer",
          `This customer already exists. This is order #${duplicateCount + 1}. Would you like to proceed?`,
          async () => {
            // Update duplicate count
            const updatedCustomer = {
              ...duplicateCustomer,
              duplicateCount: duplicateCount + 1,
            };
            await update(ref(db, `customers/${duplicateCustomerKey}`), updatedCustomer);

            showToast(duplicateCount + 1); // Show toast for duplicate entry
            form.reset(); // Clear form fields
          }
        );
        return;
      }

      // Add new customer to the database
      const newCustomerRef = push(customersRef);
      await set(newCustomerRef, {
        name,
        email,
        number,
        measureDate,
        address,
        createdAt: new Date().toISOString(),
        duplicateCount: 1, // Initial count for new customer
      });

      showToast(1); // Show toast for new customer
      form.reset(); // Clear form fields
    } catch (error) {
      console.error("Error adding customer:", error);
      showModal("Error", "Failed to add customer. Please try again.");
    }
  });
}
