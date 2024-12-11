import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

export function addCustomer(db, form, showMainScreen) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const initialQuoteDate = document.getElementById("initial-quote-date").value;
    const address = document.getElementById("address").value;

    try {
      const customersRef = ref(db, "customers");
      const newCustomerRef = push(customersRef);
      await set(newCustomerRef, {
        name,
        email,
        number,
        initialQuoteDate,
        address,
        status: "Pending",
        checklist: {
          messaged: false,
          emailed: false,
          called: false,
        },
      });
      alert("Customer added successfully!");
      form.reset();
      showMainScreen();
    } catch (error) {
      alert("Error: Failed to add customer.");
      console.error("Error adding customer:", error);
    }
  });
}
