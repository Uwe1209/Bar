Vue.createApp({
  data() {
    return {
      cart: [],
      image: "img/b.jpg",
      imageGroups: [
        [
          "img/move/m_1.jpg",
          "img/move/m_2.jpg",
          "img/move/m_3.jpg",
          "img/move/m_4.png"
        ],
        [
          "img/move/m_5.jpg",
          "img/move/m_6.jpg",
          "img/move/m_7.jpg",
          "img/move/m_8.jpg"
        ]
      ],
      dataset: [
        {
          id: "beer",
          imageP: "img/b.jpg",
          h: "Refreshing and expertly brewed",
          des: "From craft to classic, elevate any occasion with the perfect pour",
        },
        {
          id: "wine",
          imageP: "img/wi.jpg",
          h: "Elegant and refined",
          des: "Discover bold reds, crisp whites, and sparking delights, crafted for timesless moments",
        },
        {
          id: "wiskey",
          imageP: "img/w.jpg",
          h: "Bold and distinguished",
          des: "Explore aged blends and single malts made for those who savor sophistication",
        },
      ],
    };
  },
  methods: {
    updateProduct(imageP) {
      this.image = imageP;
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
  },
}).mount("#app");
