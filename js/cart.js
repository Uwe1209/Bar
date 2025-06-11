const { createApp } = Vue;

createApp({
  data() {
    return {
      cart: [],
      promoCode: "",
      promoApplied: false,
      discountPercent: 0,
    };
  },
  computed: {
    selectedItems() {
      return this.cart.filter((item) => item.selected);
    },
    cartTotal() {
      return this.selectedItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace("RM", "")) || 0;
        return sum + price * (item.quantity || 0);
      }, 0);
    },
    discountAmount() {
      return (this.cartTotal * this.discountPercent) / 100;
    },
    deliveryFee() {
      return this.cartTotal * 0.05;
    },
    discountedTotal() {
      return this.cartTotal - this.discountAmount;
    },
    finalTotal() {
      return this.discountedTotal + this.deliveryFee;
    },
  },
  methods: {
    formatPrice(val) {
      return "RM" + val.toFixed(2);
    },
    updateCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    removeItem(index) {
      this.cart.splice(index, 1);
      this.updateCart();
    },
    applyPromo() {
      const userEmail = localStorage.getItem("user_email");

      if (!userEmail) {
        alert("Please log in to use promo codes.");
        return;
      }

      const usedPromos = JSON.parse(localStorage.getItem("usedPromos") || "{}");

      if (usedPromos[userEmail]?.includes(this.promoCode)) {
        alert("Promo code already used.");
        return;
      }

      if (this.promoCode === "MondayBlue") {
        this.discountPercent = 10;
        this.promoApplied = true;
        alert("Promo code applied: 10% off!");
      } else {
        alert("Invalid promo code.");
      }
    },
    checkout() {
      const userEmail = localStorage.getItem("user_email");

      if (!userEmail) {
        alert("Please log in first to proceed.");
        return;
      }

      const selectedItems = this.cart.filter((item) => item.selected);

      if (selectedItems.length === 0) {
        alert("Please select at least one product to checkout.");
        return;
      }

      const timestamp = new Date().toLocaleString("en-GB");
      let purchaseHistory = JSON.parse(
        localStorage.getItem("purchaseHistory") || "{}"
      );
      let usedPromos = JSON.parse(localStorage.getItem("usedPromos") || "{}");

      if (!purchaseHistory[userEmail]) {
        purchaseHistory[userEmail] = [];
      }

      if (this.promoApplied && this.discountPercent > 0 && this.promoCode) {
        if (!usedPromos[userEmail]) usedPromos[userEmail] = [];
        usedPromos[userEmail].push(this.promoCode);
        localStorage.setItem("usedPromos", JSON.stringify(usedPromos));
      }

      purchaseHistory[userEmail].push({
        orderId: Date.now(),
        timestamp: timestamp,
        items: selectedItems,
        discount: this.discountPercent,
        promoCode: this.promoCode,
        deliveryFee: this.deliveryFee,
        total: this.finalTotal,
      });

      localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));

      alert("Checkout successful!");
      this.cart = this.cart.filter((item) => !item.selected);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      this.discountPercent = 0;
      this.promoCode = "";
      this.promoApplied = false;
    },
  },
  mounted() {
    try {
      const stored = localStorage.getItem("cart");
      this.cart = stored
        ? JSON.parse(stored).map((item) => ({ ...item, selected: false }))
        : [];
    } catch (err) {
      console.error("Failed to load cart:", err);
      this.cart = [];
    }
  },
}).mount("#app");
