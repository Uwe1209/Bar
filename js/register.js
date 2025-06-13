const { createApp, ref } = Vue;

createApp({
  setup() {
    const form = ref({
      name: "",
      email: "",
      password: "",
      re_password: "",
    });

    const message = ref("");

    const register = async (event) => {
      event.preventDefault(); 
      const password = form.value.password;

      if (!password) {
        message.value = "Password cannot be empty.";
        return;
      }

      if (password.length < 8) {
        message.value = "Password must be at least 8 characters long.";
        return;
      }

      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        message.value = "Password must include both letters and numbers.";
        return;
      }

      if (password !== form.value.re_password) {
        message.value = "Passwords do not match.";
        return;
      }

      try {
        const response = await fetch("resources/register.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.value),
        });

        const data = await response.json();
        message.value = data.message;

        if (data.success) {
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1000);
        }
      } catch (error) {
        message.value = "Something went wrong. Check PHP or network.";
        console.error(error);
      }
    };

    return { form, register, message };
  },
}).mount("#app");
