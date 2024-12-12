import { ref, onValue, push, set, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

function showModal(title, message, onConfirm = null) {
  const modal = document.getElementById("custom-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const modalConfirm = document.getElementById("modal-confirm");
  const modalCancel = document.getElementById("modal-cancel");

  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.classList.remove("hidden");

  const confirmHandler = () => {
    if (onConfirm) onConfirm();
    hideModal();
  };

  const cancelHandler = () => hideModal();

  modalConfirm.addEventListener("click", confirmHandler, { once: true });
  modalCancel.addEventListener("click", cancelHandler, { once: true });
}

function hideModal() {
  const modal = document.getElementById("custom-modal");
  modal.classList.add("hidden");
}

export function handleAddCustomer(db, form) {
  const toast = document.getElementById("toast");
  const orderNumberSpan = document.getElementById("order-number");

  const showToast = (orderNumber) => {
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
      showModal("Validation Error", "Please select a status.");
      return;
    }

    try {
      const customersRef = ref(db, "customers");

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
            const updatedCustomer = {
              ...duplicateCustomer,
              duplicateCount: duplicateCount + 1,
            };
            await update(ref(db, `customers/${duplicateCustomerKey}`), updatedCustomer);

            showToast(duplicateCount + 1);
            form.reset(); // Clear form fields but stay on the current screen
          }
        );
        return;
      }

      const newCustomerRef = push(customersRef);
      await set(newCustomerRef, {
        name,
        email,
        number,
        measureDate,
        address,
        status,
        createdAt: new Date().toISOString(),
        duplicateCount: 1,
      });

      showToast(1); // Show toast for new customer
      form.reset(); // Clear form fields
    } catch (error) {
      console.error("Error adding customer:", error);
      showModal("Error", "Failed to add customer. Please try again.");
    }
  });
}
