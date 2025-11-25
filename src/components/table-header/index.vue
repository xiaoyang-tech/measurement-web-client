<template>
  <div class="table-interpretation">
    <div class="title">
      <span>{{ label }}</span>
    </div>
    <div v-if="isSlot" class="text">
      <text-more :message="message" />
    </div>
    <div v-else class="interpretation-container">
      <slot name="container"></slot>
    </div>
  </div>
</template>

<script>
import TextMore from "../text-more/index.vue";

export default {
  props: {
    label: {
      type: String,
      default: () => "",
    },
    isSlot: {
      type: Boolean,
      default: true,
    },
    message: {
      type: String,
      default: () => "",
    },
  },
  components: {
    TextMore,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@use "../../assets/css/index.css";
.interpretation-container {
  padding: 10px;
}
</style>
