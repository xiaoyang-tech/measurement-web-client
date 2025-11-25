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
export default {
  props: {
    value: {
      type: Boolean,
      default: () => false,
    },
    userInfo: {
      // 用户信息
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      Measurement: null,
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
            env: import.meta.env.MODE,
            token,
          },
          ...[categories]
        );
        this.listenerMeasurementEvent();
        this.Measurement.server = import.meta.env.VITE_MEASUREMENT_URL;
        this.Measurement.start();
      } catch (error) {
        console.log("error", error);
      }
    },
    listenerMeasurementEvent() {
      this.Measurement.addEventListener("crashed", async (sender, e) => {
        console.log("crashed", e);
        showDialog({
          title: "系统消息",
          type: "fail",
          message: e?.message || "人脸超出边界，请重新开始测量",
        });
        this.$emit("handleEvent", "dispose");
        this.interrupt();
      });
      this.Measurement.addEventListener("interrupted", () => {
        console.log("interrupted 终止测量");
        this.$emit("handleEvent", "dispose");
      });
      /**
       * 开始测量 回掉
       */
      this.Measurement.addEventListener("started", async (sender, { measurementId }) => {
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
      });
      /**
       * 监听回传的阶段性测量结果
       */
      this.Measurement.addEventListener("chunkReportGenerated", (sender, result) => {
        console.log("chunkReportGenerated", result);
        this.$emit("handleEvent", "chunkReportGenerated", result);
      });

      /**
       * 新完整报告
       */
      this.Measurement.addEventListener("wholeReportGenerated", async (sender, data) => {
        await this.reportProcessed(data);
        console.log("wholeReportGenerated", data);
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
          // await createMeasurement();
          // const { data: result } = await webMeasurement(this.Measurement.measurementId);
          this.$emit("handleEvent", "completed"); // 标记测量已经完成
        } else {
          console.log(msg);
          showDialog({ title: "系统消息", type: "fail", message: msg });
        }
      } catch (e) {
        console.log(e);
        showDialog({
          title: "测量服务通讯错误，请检查网络后重试",
          type: "fail",
          message: msg,
        });
      }
    },
    interrupt() {
      this.Measurement && this.Measurement?.interrupt();
    },
  },
};
</script>
<style lang="scss" scoped>
.mediapipe-video,
.mediapipe-canvas {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.mediapipe-canvas {
  z-index: 10;
  position: absolute;
}

// .mediapipe-video {
//   z-index: 1;
//   // object-fit: cover; /* 铺满屏幕，保持宽高比 */
//   transform: scaleX(-1);
// }
.mediapipe-video,
.mediapipe-canvas {
  position: fixed;
  left: 50%;
  top: 50%;
  object-position: center center;
  z-index: 1;
}
.mediapipe-video {
  transform: translate(-50%, -50%) scaleX(-1); /* 需要镜像就保留 */
}
.mediapipe-canvas {
  transform: translate(-50%, -50%);
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
  height: 100svh; /* Android 推荐用 svh */
}

.mediapipe-canvas {
  z-index: 10;
}
</style>
