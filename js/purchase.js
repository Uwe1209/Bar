const { createApp } = Vue;

createApp({
  data() {
    return {
      orders: [],
      cart: [],
      userEmail: "",
    };
  },
  methods: {
    cancelOrder(orderId) {
      if (!confirm("Are you sure you want to cancel this order?")) return;
      this.orders = this.orders.filter((order) => order.orderId !== orderId);
      this.saveOrders();
    },
    removeItem(orderId, itemIndex) {
      const order = this.orders.find((o) => o.orderId === orderId);
      if (!order) return;
      order.items.splice(itemIndex, 1);
      this.saveOrders();
    },
    saveOrders() {
      const history = JSON.parse(
        localStorage.getItem("purchaseHistory") || "{}"
      );
      history[this.userEmail] = this.orders;
      localStorage.setItem("purchaseHistory", JSON.stringify(history));
    },
  },

  mounted() {
    this.userEmail = localStorage.getItem("user_email");
    if (!this.userEmail) {
      alert("Please log in to view your purchases.");
      return;
    }

    const history = JSON.parse(localStorage.getItem("purchaseHistory") || "{}");
    this.orders = (history[this.userEmail] || []).map((order) => ({
      ...order,
      editMode: false,
    }));
  },
}).mount("#app");

window.addEventListener("DOMContentLoaded", () => {
  const acc = document.getElementsByClassName("c");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      const details = this.nextElementSibling;
      if (details.style.display === "block") {
        details.style.display = "none";
      } else {
        details.style.display = "block";
      }
    });
  }
});
