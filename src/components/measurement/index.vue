<template>
  <div>
    <video
      id="mediapipe-video"
      ref="mediapipe-video"
      class="mediapipe-video"
      autoplay
      playsinline
      preload="metadata"
      muted
      webkit-playsinline="webkit-playsinline"
    ></video>
    <canvas id="mediapipe-canvas" class="mediapipe-canvas"></canvas>
  </div>
</template>
<script>
import { Measurement, MeasurementCategory } from "xiaoyang-health-measurement";
import { showDialog } from "vant";
import { MEASUREMENT } from "../../utils/messages";
export default {
  emits: ['handleEvent'],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      Measurement: null,
      reportReceived: false,
    };
  },
  computed: {
    categoryType() {
      // 类型 公众号配置参数
      return this.$route.query?.categoryType;
    },
  },
  async beforeUnmount() {
    this.interrupt();
  },
  methods: {
    /**
     * 第一步：创建 Measurement 对象并监听事件（不启动）
     * 在位置验证通过后调用
     */
    async handleStartMeasurement(token, categories) {
      // 创建测量
      try {
        if (["1", 1, "2", 2].includes(this.categoryType)) {
          // 根据类型传入
          categories = ["1", 1].includes(this.categoryType)
            ? MeasurementCategory.EMOTION
            : MeasurementCategory.PHYSIOLOGY;
        }
        this.Measurement = await new Measurement(
          {
            videoId: "mediapipe-video",
            token,
            measurementDuration: 15000,
          },
          ...[categories]
        );
        this.listenerMeasurementEvent();
      } catch (error) {
        console.error("handleStartMeasurement error:", error);
      }
    },
    /**
     * 第二步：启动 Measurement（在倒计时结束后调用）
     */
    async startMeasurement() {
      if (this.Measurement) {
        await this.Measurement.start();
      } else {
      }
    },
    listenerMeasurementEvent() {
      this.Measurement.addEventListener("crashed", async (sender, e) => {
        console.log("crashed", e);
        showDialog({
          title: MEASUREMENT.SYSTEM_MESSAGE,
          type: "fail",
          message: e?.message || MEASUREMENT.FACE_OUT_OF_BOUNDS,
        });
        this.$emit("handleEvent", "dispose");
        this.interrupt();
      });
      this.Measurement.addEventListener("interrupted", () => {
        console.log("interrupted 终止测量");
        if (!this.reportReceived) {
          this.$emit("handleEvent", "dispose");
        }
      });
      /**
       * 开始测量回调
       */
      this.Measurement.addEventListener("started", async (sender, measurementId) => {
        this.$emit("handleEvent", "startProgress", {
          measurementId,
          deviceNo: this.Measurement.deviceNo,
        });
      });
      /**
       * 视频传送完成
       */
      this.Measurement.addEventListener("collected", () => {
        console.log("collected 视频传送完成");
        // 触发 collected 事件，通知父组件切换提示文案
        this.$emit("handleEvent", "collected");
      });
      /**
       * 采集进度更新（由 SDK 驱动）
       */
      this.Measurement.addEventListener("captureProgressUpdated", (sender, data) => {
        this.$emit("handleEvent", "updateProgress", data?.progress ?? 0);
      });
      /**
       * 监听回传的阶段性测量结果
       */
      this.Measurement.addEventListener("chunkReportGenerated", (sender, result) => {
        this.$emit("handleEvent", "chunkReportGenerated", result);
      });

      /**
       * 新完整报告
       */
      this.Measurement.addEventListener("wholeReportGenerated", async (sender, data) => {
        this.reportReceived = true;
        await this.reportProcessed(data);
      });
      // 人脸状态变化事件（SDK 事件名：stateUpdated）
      this.Measurement.addEventListener("stateUpdated", (sender, params) => {
        const { level, msg } = params;
        this.$emit("handleEvent", "updateMessage", { level, message: msg });
      });
    },
    async reportProcessed(data) {
      const { hrreport } = data;
      const { code, msg } = hrreport;
      const map = {
        emotionscorereport: "emotionscore",
        physiologyscorereport: "score",
        msireport: "msi",
        fatiguereport: "fatigue",
        suppressionreport: "suppression",
        positivityreport: "positivity",
        vitalityreport: "vitality",
        depressionreport: "depression",
        anxietyreport: "anxiety",
        aggressivityreport: "aggressivity",
        spo2hreport: "spo2h",
        afreport: "af",
      };
      try {
        if (code === 1100) {
          let ruleForm = {};
          let explanation = {};
          let mapKey = [];
          Object.keys(map).forEach((key) => {
            mapKey.push(key);
          });
          Object.keys(data).forEach((key) => {
            if (data[key]) {
              if (data[key].data || data[key].data >= 0) {
                if (mapKey.includes(key)) {
                  if (key === "afreport") {
                    ruleForm[map[key]] = data[key].data === 1;
                  } else {
                    ruleForm[map[key]] = data[key].data;
                  }
                } else {
                  ruleForm = { ...ruleForm, ...data[key].data };
                }
              }
              if (data[key].explanation) {
                if (mapKey.includes(key)) {
                  explanation[map[key]] = data[key].explanation;
                } else {
                  explanation = { ...explanation, ...data[key].explanation };
                }
              }
            }
          });
          localStorage.setItem(
            "report",
            JSON.stringify({
              measurementId: this.Measurement.measurementId,
              ...ruleForm,
              explanation: JSON.stringify(explanation),
            })
          );
          this.$emit("handleEvent", "completed");
        } else {
          console.error("report processing error:", msg);
          showDialog({ title: MEASUREMENT.SYSTEM_MESSAGE, type: "fail", message: msg });
        }
      } catch (e) {
        console.error("reportProcessed error:", e);
        showDialog({
          title: MEASUREMENT.NETWORK_ERROR,
          type: "fail",
          message: msg,
        });
      }
    },
    interrupt() {
      this.Measurement && this.Measurement?.interrupt();
    },
    /** 获取视频 DOM 元素 */
    getVideoElement() {
      return this.$refs['mediapipe-video'];
    },
    /** 获取画布 DOM 元素 */
    getCanvasElement() {
      return document.getElementById('mediapipe-canvas');
    },
  },
};
</script>
<style lang="scss" scoped>
.mediapipe-video,
.mediapipe-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
/* iOS Safari 对 position:fixed + transform:translate 合成时使用低分辨率光栅化，
   导致模糊。视频用 object-fit:cover 替代 translate 居中，仅保留 scaleX(-1) 镜像 */
.mediapipe-video {
  object-fit: cover;
  transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
}
.mediapipe-canvas {
  z-index: 10;
  /* CornerMarker.handleResize() 已通过 inline style 精确设置宽高 */
}
</style>
