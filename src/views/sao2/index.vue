<template>
  <div class="page">
    <!-- 数据加载中显示 loading -->
    <div v-if="isLoading" class="loading-container">
      <van-loading type="spinner" color="#4d9eff" size="24px" vertical>
        数据加载中...
      </van-loading>
    </div>
    <div class="page-container" v-if="report && !isLoading">
      <div ref="card-container" class="card-container">
        <div v-for="(row, index) in config" :key="index">
          <item
            :row="row"
            :value="report[row.value]"
            @to-router="
              toRouter(
                row.Category,
                row.label,
                explanation[row.value.toLowerCase()],
                report[row.value],
                row.data,
                row.value
              )
            "
          />
        </div>
      </div>
      <div class="footer">
        <div class="table-container">
          <div class="table-header flex-row">
            <span class="line"></span>
            <span class="title">报告图例</span>
          </div>
          <div class="chart">
            <div
              class="flex-item"
              v-for="({ label, color }, key) in footerConfig"
              :key="key"
            >
              <span class="tip" :style="{ background: color }"></span>
              <span class="text" :style="{ color: color }">{{ label }}</span>
            </div>
          </div>
          <div class="info flex-row">
            <span class="font_family icon-tishi"></span
            >点击报告单项，可以查看每项指标详情！
          </div>
        </div>
        <template>
          <div class="flex-row footer-code space-between">
            <div class="flex-item">
              <div class="title">小阳科技客服</div>
              <img src="../../assets/left-qrcode.png" alt="" />
              <div class="text">扫一扫上面的二维码图案，加我为好友。</div>
            </div>
            <div class="flex-item">
              <div class="title">小阳活力节拍公众号</div>
              <img src="../../assets/right-qrcode.png" alt="" />
              <div class="text">扫一扫关注公众号，下载活力节拍</div>
            </div>
          </div>
          <div class="reference">报告仅供参考，请以医院结果为准</div>
        </template>
      </div>
      <div class="btn" @click="lickHander()">
        下载活力节拍，体验更多测量 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>
<script>
import { reportConfig } from "../../utils/report-config";
import {
  Icon,
  Overlay,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Field,
  Button,
  Image,
  Loading,
} from "vant";
const footerConfig = [
  { label: "优秀", color: "#6EDAA9" },
  { label: "良好", color: "#85c9fa" },
  { label: "轻度不健康", color: "#FCCE57" },
  { label: "中度不健康", color: "#FC9557" },
  { label: "重度不健康", color: "#FF5252" },
];

import Item from "./item/index.vue";
import "vant/lib/button/style/index";
export default {
  components: {
    Item,
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Button.name]: Button,
    [Image.name]: Image,
    [Loading.name]: Loading,
  },
  data() {
    return {
      // report: null, // 数据
      isLoading: false, // 数据加载状态
      query: {
        latitude: "",
        longitude: "",
        measurementId: "",
      },
    };
  },
  computed: {
    ageData() {
      return [
        { min: 0, max: 25, total: 100, color: "#FF5252", label: "重度不健康" },
        { min: 25, max: 50, total: 100, color: "#FC9557", label: "轻度不健康" },
        { min: 50, max: 75, total: 100, color: "#FCCE57", label: "良好" },
        { min: 75, max: 100, total: 100, color: "#6EDAA9", label: "优秀" },
      ];
    },
    report() {
      if (!localStorage.getItem("report")) return null;
      return JSON.parse(localStorage.getItem("report"));
    },
    explanation() {
      const { explanation } = this.report;
      return explanation || null;
    },
    config() {
      return reportConfig.filter((ele) => ![null, -1].includes(this.report[ele.value]));
    },
    footerConfig() {
      return footerConfig;
    },
    measurementId() {
      return this.$route.query.measurementId;
    },
    // detail() {
    //   return this.$store.state.detail;
    // },
    type() {
      return this.$route.query.type;
    },
  },
  methods: {
    async toRouter(category, label, terms, score, config, valueKey) {
      try {
      } catch (e) {
        console.log(e);
        alert(e);
      }
    },
    getColor(ranking, data) {
      let row = {
        color: "#ff5252",
      };
      if (ranking >= 0 && ranking <= 100) {
        row = data.find(({ min, max }) => ranking >= min && ranking < max);
      }
      return {
        color: row.color,
      };
    },
    lickHander() {
      window.location.href = "https://xymind.cn/#/about";
    },
  },
  mounted() {
    // if (this.detail) {
    //   this.report = {
    //     ...this.detail,
    //   };
    // }
  },
};
</script>
<style lang="scss" scoped>
@use "../../assets/css/index";

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #fff;
}

.mask {
  position: relative;
  &.bg-mask:after {
    content: "";
    position: absolute;
    top: 30px;
    right: 1px;
    bottom: 1px;
    left: 1px;
    //background: #fff;
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 1) 35px
    );
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
.pay-container {
  width: 280px;
  height: 280px;
  background: #fff;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .wrapper-container {
    min-width: 280px;
    min-height: 100px;
    background: #fff;
    border-radius: 5px;
    padding: 10px 10px 20px;
    .van-icon {
      margin-right: 10px;
      font-size: 30px;
    }
    .van-icon-wechat {
      color: #3dbc0c;
    }
    .van-icon-alipay {
      color: #3aa1e8;
    }
    .cell-icon {
      background: red;
    }
  }
}
.card {
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ebeff2;
  border-radius: 8px;
  position: relative;

  &:nth-child(even) {
    background: rgba(248, 248, 248, 0.9);
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    position: relative;
    padding-left: 10px;
    display: flex;
    align-items: center;
    .icon {
      width: 30px;
      height: 30px;
      margin-right: 5px;
    }
    &:after {
      position: absolute;
      content: "";
      width: 1px;
      height: 14px;
      left: 0;
      background: #5086ec;
    }
  }
  .tip-info {
    position: absolute;
    font-size: 16px;
    color: #42b983;
    left: 1px;
    right: 1px;
    z-index: 1;
    cursor: pointer;
    top: 40px;
    font-weight: 700;
    text-align: center;
    padding-top: 40px;
    bottom: 0;
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 1) 35px
    );
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
.ai-button {
  color: #3aa1e8;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
//::v-deep .page-container {
//  .mask {
//    position: relative;
//    .mask-show {
//      position: absolute;
//      left: 0;
//      right: 0;
//      bottom: 0;
//      top: 0;
//      background: #fff;
//      z-index: 10000;
//    }
//  }
//
//  .mask:nth-child(n + 2) {
//    .mask-show {
//      top: -12px;
//      background: #fff;
//    }
//  }
//  .mask:nth-child(3) {
//    .mask-show {
//      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 28px, #fff , #fff);
//    }
//  }
//}
//~ .mask {
//  background: red!important;
//  //.mask-show {
//  //  background: red;
//  //}
//}
::deep {
  .age {
    .echarts-list {
      .label {
        display: none;
      }
    }
  }
}
.button-content {
  display: flex;
}
.bg-button {
  padding: 5px 10px;
  color: #fff;
  font-size: 12px;
  border-radius: 15px;
}
.arrow {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  ::deep {
    .van-icon:nth-child(2) {
      position: relative;
      top: -10px;
    }
  }
}
.btn {
  background: #4d9eff;
  padding: 12px 15px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  border-radius: 5px;
}
.footer .chart {
  // justify-content: flex-start;
  // flex-wrap: wrap;
  // padding-top: 10px;
  display: flex;
}
.footer .chart > .flex-item {
  margin: 10px;
  display: flex;
}
.footer .chart > .flex-item .tip {
  width: 20px;
  height: 12px;
  margin-right: 10px;
  border-radius: 3px;
}
.footer .chart > .flex-item .text {
  font-size: 12px;
}
.footer .info {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
  align-items: center;
}
.footer .code {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.footer .code img {
  object-fit: cover;
}
.footer .code .text {
  font-size: 12px;
  line-height: 40px;
}
.footer .reference {
  background: rgb(252, 250, 253);
  font-size: 15px;
  line-height: 30px;
  padding-bottom: 30px;
  text-align: center;
  color: rgb(204, 204, 204);
}
</style>
