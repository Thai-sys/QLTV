<template>
  <div class="" container>
    <Header />
    <Login />
  </div>
</template>

<script>
import Header from "@/components/header/header.vue";
import Login from "@/components/auth/login_form.vue";

export default {
  components: { Header, Login },
};
</script>

<style scoped>
</style>
