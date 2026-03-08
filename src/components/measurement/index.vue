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
            measurementUrl: import.meta.env.VITE_MEASUREMENT_URL,
            measurementDuration: 30000,
          },
          ...[categories]
        );
        this.listenerMeasurementEvent();
        this.Measurement.start();
      } catch (error) {
        console.error("handleStartMeasurement error:", error);
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
      this.Measurement.addEventListener("faceSafetyStatus", (sender, params) => {
        // console.log("faceSafetyStatus", params);
        const { level, hint } = params;
        this.$emit("handleEvent", "updateMessage", { level, message: hint });
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
  left: 50%;
  top: 50%;
  object-position: center center;
  z-index: 1;
}
.mediapipe-video {
  transform: translate(-50%, -50%) scaleX(-1);
}
.mediapipe-canvas {
  transform: translate(-50%, -50%);
  z-index: 10;
}
/* 以宽铺满：横向撑满，不变形（可能上下裁剪） */
.mediapipe-video.fit-width,
.mediapipe-canvas.fit-width {
  width: 100vw;
  height: auto;
}
/* 以高铺满：纵向撑满，不变形（可能左右裁剪） */
.mediapipe-video.fit-height,
.mediapipe-canvas.fit-height {
  width: auto;
  height: 100svh;
}
</style>
