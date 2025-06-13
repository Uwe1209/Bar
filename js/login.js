const { createApp, ref } = Vue;

createApp({
  setup() {
    const form = ref({
      email: '',
      password: ''
    });

    const message = ref('');

    const login = async () => {
      try {
        const response = await fetch("resources/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.value),
        });

        const data = await response.json();
        message.value = data.message;

        if (data.success) {
          localStorage.setItem("user_email", form.value.email);
          window.location.href = "account.html";
        }

      } catch (err) {
        message.value = "Network or server error.";
        console.error(err);
      }
    };

    return { form, message, login };
  }
}).mount("#app");
