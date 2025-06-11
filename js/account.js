const { createApp, ref, onMounted } = Vue;

createApp({
  data() {
    return {
      cart: [],
    };
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
  setup() {
    const user = ref(null);
    const editMode = ref(false);
    const selectedFile = ref(null);
    const fileInput = ref(null);
    const loggedIn = ref(false);

    const logout = () => {
      localStorage.removeItem("user_email");
      loggedIn.value = false;
      return;
    };

    const triggerImageUpload = () => {
      fileInput.value.click();
    };

    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file || !user.value?.email) return;

      const formData = new FormData();
      formData.append("img", file);
      formData.append("email", user.value.email);

      const res = await fetch("resources/update_img.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.img) {
        user.value.img = data.img;
      } else {
        alert(data.message || "Failed to upload image.");
      }
    };

    const updateUser = async () => {
      const formData = new FormData();
      formData.append("name", user.value.name);
      formData.append("gender", user.value.gender);
      formData.append("DOB", user.value.DOB);
      formData.append("phone", user.value.phone);
      formData.append("address", user.value.address);
      formData.append("email", user.value.email);

      if (selectedFile.value) {
        formData.append("img", selectedFile.value);
      }

      const res = await fetch("resources/update_user.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        editMode.value = false;
        if (data.img) {
          user.value.img = data.img;
        }
      }
    };

    onMounted(async () => {
      const email = localStorage.getItem("user_email");
      if (!email) {
        loggedIn.value = false;
        return;
      }

      const res = await fetch("resources/get_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        user.value = data.user;
        loggedIn.value = true;
      } else {
        loggedIn.value = false;
      }
    });

    return {
      user,
      editMode,
      logout,
      updateUser,
      triggerImageUpload,
      handleFileUpload,
      fileInput,
      loggedIn,
    };
  },
}).mount("#app");
