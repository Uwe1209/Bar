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

    const register = async () => {
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
        message.value = "Something went wrong. Check PHP or Network tab.";
        console.error(error);
      }
    };

    return { form, register, message };
  },
}).mount("#app");
