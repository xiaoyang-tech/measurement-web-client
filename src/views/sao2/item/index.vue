<template>
  <div class="row">
    <item-content :title="row.label">
      <template #icon v-if="!['score'].includes(row.value)">
        <img class="icon" :src="iconUrl(row.value)" alt="" />
      </template>
      <div class="row-content" @click="$emit('to-router')">
        <template v-if="['score', 'emotionScore'].includes(row.value)">
          <gauge-echarts
            :value-key="['healtH_SCORE']"
            style="margin: 0 auto"
            :config="row.data"
            :rule-form="{ healtH_SCORE: value }"
          />
        </template>
        <template v-else-if="['af'].includes(row.value)">
          <van-button
            type="primary"
            size="mini"
            round
            :color="`${!value ? '#6edaa9' : '#ff5252'}`"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;
            {{ !value ? "未发作" : "发作" }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </van-button>
        </template>
        <template v-else>
          <lines :data="row.data" :label="row.label" :score="value" />
        </template>
      </div>
    </item-content>
  </div>
</template>
<script>
import "vant/lib/button/style";
import ItemContent from "../content.vue";
import GaugeEcharts from "../../../components/echarts/index.vue";
import Lines from "../../../components/lines/index.vue";
import { Button } from "vant";

// Use Vite glob to statically resolve asset URLs respecting BASE_URL
const iconModules = import.meta.glob("../../../assets/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

export default {
  components: {
    [Button.name]: Button,
    GaugeEcharts,
    ItemContent,
    Lines,
  },
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: [Number, String, Boolean],
      default: () => 0,
    },
  },
  methods: {
    iconUrl(name) {
      return iconModules[`../../../assets/${name}.png`] || "";
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  width: 30px;
  height: 30px;
  margin-left: 10px;
}
</style>
