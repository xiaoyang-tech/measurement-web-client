<template>
  <div class="details-wrapper">
    <div class="wrapper-header">
      <div class="wrapper-header-content">
        <slot name="icon"></slot>
        <span class="text">{{title}}</span>
      </div>
      <slot name="btn"></slot>
    </div>
    <div class="wrapper-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => ''
    }
  }
}
</script>
<style lang="scss" scoped>
.details-wrapper{
  border: 1px solid #EBEFF2;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 10px;
}
.wrapper-header {
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    width: 1px;
    height: 16px;
    // top: 1px;
    top: calc((100% - 16px)/ 2);
    background-color: #5086ec;
  }
  .wrapper-header-content {
    display: flex;
    align-items: center;
  }
  .text {
    padding-left: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
}
.wrapper-content {
  padding-top: 10px;
  padding-left: 10px;
}
</style>