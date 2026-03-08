<template>
  <div ref="textMoreRef" class="text-more"
     :class="classObj"
  >
    <span style="white-space: pre-line;">{{ message }}</span>
    <span
      v-if="showMore"
      class="more"
      :class="{'more-position': !more }"
      @click="more = !more"
    >
      {{ more ? `...收起` : '更多...' }}
    </span>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  lines: {
    type: Number,
    default: 2
  },
  offsetHeight: {
    type: Number,
    default: 30
  }
})

const more = ref(false)
const showMore = ref(false)
const textMoreRef = ref(null)

const classObj = computed(() => {
  const classes = []
  if (showMore.value && !more.value) {
    classes.push('line-clamp')
  }
  classes.push(`line-clamp-${props.lines}`)
  return classes
})

onMounted(() => {
  nextTick(() => {
    if (textMoreRef.value && textMoreRef.value.offsetHeight > props.offsetHeight) {
      showMore.value = true
    }
  })
})
</script>

<style lang="scss" scoped>
.text-more {
  word-wrap: break-word;
  position: relative;
  font-size: 15px;
  line-height: 24px;
  font-weight: 400;
  overflow: hidden;
  font-family: inter-regular;
  color: #86909C;
  min-height: 30px;
  white-space: pre-line;
  &.line-clamp {
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-box-orient: vertical;

  }
  &.line-clamp-2 {
    -webkit-line-clamp: 2;//当属性值为3，表示超出3行隐藏
  }
  &.line-clamp-3 {
    -webkit-line-clamp: 3;//当属性值为3，表示超出3行隐藏
  }
  &.line-clamp-4 {
    -webkit-line-clamp: 4;//当属性值为3，表示超出3行隐藏
  }
  &.line-clamp-5 {
    -webkit-line-clamp: 5;//当属性值为3，表示超出3行隐藏
  }
  &.line-clamp-6 {
    -webkit-line-clamp: 6;//当属性值为3，表示超出3行隐藏
  }
  .more {
    cursor: pointer;
    color: #1890FF;
    &.more-position {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 15px;
      width: 50px;
      text-align: right;
      background-image: linear-gradient(to right , transparent, #fff, #fff, #fff);
    }
  }
}
</style>
