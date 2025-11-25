<template>
  <div v-if="mask" class="measurement-layout">
    <div class="content">
      <div class="frame">
        <img class="default-image" src="../../assets/images/default.png" alt="" />
      </div>
      <div class="t1">测量时请注视摄像头</div>
      <div class="t2">请保持面部轮廓在取景框中根据屏幕提示完成测量</div>
    </div>
    <div class="operate">
      <div class="btn" :class="{ 'is-disabled': loading }" @click="$emit('start')">
        <van-loading v-if="loading" type="spinner" color="#fff" />
        &nbsp; 开始测量
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    mask: {
      type: Boolean,
      default: () => false,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
  },
};
</script>
<style lang="scss" scoped>
.measurement-layout {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 30;
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .t1,
    .t2 {
      text-align: center;
    }
    .t1 {
      padding-top: 40px;
      font-size: 20px;
      color: #1a1a1a;
    }
    .t2 {
      padding-top: 20px;
      color: #999999;
      font-size: 16px;
    }
  }
  .operate {
    height: 15vh;
    padding: 0 40px;
    .btn {
      background: #2687fe;
      height: 60px;
      max-width: 500px;
      // max-width: 460px;
      border-radius: 30px;
      margin: 0 auto;
      color: #fff;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 18px 30px 0px rgba(29, 135, 240, 0.3);
      &.is-disabled {
        background: rgba(38, 135, 254, 0.3);
      }
    }
  }
  .frame {
    position: relative;
    max-width: 270px;
    margin: 0 auto;
    &::after {
      position: absolute;
      content: "";
      left: -5px;
      right: -5px;
      top: 0px;
      height: 370px;
      border: 5px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
    &::before {
      position: absolute;
      width: 10px;
      content: "";
      height: 10px;
      left: calc(100% / 2 - 5px);
      border-radius: 10px;
      top: 20px;
      border: 5px solid rgba(0, 0, 0, 0.1);
    }
  }
  .default-image {
    width: 270px;
    display: block;
    margin: 0 auto;
  }
}
</style>
