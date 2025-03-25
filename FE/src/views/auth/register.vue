<template>
  <div>
    <Header/>
    <Register/>
  </div>
</template>

<script>
import Header from "@/components/header/header.vue";
import Register from "@/components/auth/register_form.vue";

export default {
  components: { Header,Register },
};
</script>

<style scoped>
.card img {
  height: 200px;
  object-fit: cover;
}
</style>
