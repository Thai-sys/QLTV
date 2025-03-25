<template>
  <div class="" container>
    <Header />
    <AdminLoginForm />
  </div>
</template>

<script>
import Header from "@/components/header/header.vue";
import AdminLoginForm from "@/components/auth/admin_login_form.vue";

export default {
  components: { Header, AdminLoginForm },
};
</script>

<style scoped>
</style>
