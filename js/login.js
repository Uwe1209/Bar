const { createApp, ref } = Vue;

createApp({
  setup() {
    const form = ref({
      email: "",
      password: "",
    });

    const message = ref("");

    const login = async () => {
      const response = await fetch("resources/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value),
      });

      const data = await response.json();
      message.value = data.message;

      if (data.success) {
        setTimeout(() => {
          localStorage.setItem("user_email", form.value.email);
          window.location.href = "account.html";
        }, 1000);
      }
    };

    return { form, login, message };
  },
}).mount("#app");
