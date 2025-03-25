<template>
  <div class="slider-container">
    <div
      class="slider"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div v-for="(image, index) in images" :key="index" class="slide">
        <img :src="image.src" :alt="image.alt" />
      </div>
    </div>
    <button v-if="currentIndex > 0" class="prev" @click="prevSlide">
      &#10094;
    </button>
    <button
      v-if="currentIndex < images.length - 1"
      class="next"
      @click="nextSlide"
    >
      &#10095;
    </button>
  </div>
</template>

<script>
export default {
  name: "Appbanner",
  data() {
    return {
      currentIndex: 0,
      images: [],
      autoSlide: null,
      slideInterval: 10000,
    };
  },
  methods: {
    getRandomImages() {
      const allImages = [
        {
          src: new URL("../../assets/banner/1.jpg", import.meta.url).href,
          alt: "Banner 1",
        },
        // { src: new URL('@/assets/banner/2.jpg', import.meta.url).href, alt: 'Banner 2' },
        {
          src: new URL("@/assets/banner/3.jpg", import.meta.url).href,
          alt: "Banner 3",
        },
        {
          src: new URL("@/assets/banner/4.jpg", import.meta.url).href,
          alt: "Banner 4",
        },
        {
          src: new URL("@/assets/banner/flow.jpg", import.meta.url).href,
          alt: "Banner 5",
        },
        {
          src: new URL("@/assets/banner/quy_nhap_trang.jpg", import.meta.url)
            .href,
          alt: "Banner 6",
        },
      ];

      // Nếu có hơn 4 ảnh thì xáo trộn và chọn 4 ảnh đầu
      if (allImages.length > 5) {
        this.images = allImages.sort(() => Math.random() - 0.5).slice(0, 5);
      } else {
        this.images = allImages;
      }
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.resetAutoSlide();
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.resetAutoSlide();
    },
    startAutoSlide() {
      this.autoSlide = setTimeout(() => {
        this.nextSlide();
        this.startAutoSlide();
      }, this.slideInterval);
    },
    resetAutoSlide() {
      clearTimeout(this.autoSlide);
      this.startAutoSlide();
    },
  },
  mounted() {
    this.getRandomImages();
    this.startAutoSlide();
  },
  beforeUnmount() {
    clearTimeout(this.autoSlide);
  },
};
</script>

<style scoped>
.slider-container {
  width: 100vw; /* Trải rộng toàn màn hình */
  max-width: 100%;

  height: auto;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);

  margin-bottom: 15px;
}

.slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  width: 100%;
  flex: 0 0 100%;
}

.slide img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.prev,
.next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 18px;
  z-index: 10;
}

.prev {
  left: 10px;
}
.next {
  right: 10px;
}

.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
