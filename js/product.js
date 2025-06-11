const { createApp } = Vue;
const Paginate = window["VuejsPaginateNext"];
var readJsonURL = "product-data.json";

createApp({
  components: {
    paginate: Paginate,
  },
  data() {
    return {
      units: [],
      cart: [],
      currentPage: 1,
      perPage: 4,
      currentCategory: "Beer",
      searchQuery: "",
    };
  },
  computed: {
    categories() {
      return [...new Set(this.units.map((p) => p.product))];
    },
    filteredProducts() {
      return this.units.filter(
        (p) =>
          p.product === this.currentCategory &&
          p.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredProducts.slice(start, start + this.perPage);
    },
  },
  methods: {
    clickCallback(pageNum) {
      this.currentPage = pageNum;
    },
    filterCategory(category) {
      this.currentCategory = category;
      this.currentPage = 1;
    },
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find((item) => item.code === product.code);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.productName} added to cart!`);
    },
  },
  mounted() {
    try {
      const stored = localStorage.getItem("cart");
      this.cart = stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to load cart:", err);
      this.cart = [];
    }
    fetch(readJsonURL)
      .then((res) => res.json())
      .then((data) => {
        this.units = data;
      })
      .catch((error) => {
        console.error("Failed to load JSON:", error);
      });
  },
}).mount("#app");
