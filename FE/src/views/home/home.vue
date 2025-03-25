<template>
  <div>
    <Header />

 
        <Book />
    

  </div>
</template>

<script>
import Header from "@/components/header/header.vue";
import Book from "@/components/book/book.vue";

export default {
  components: { Header, Book },
};
</script>
