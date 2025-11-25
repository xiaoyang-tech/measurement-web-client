<template>
  <div>
    <mask-page :mask="mask" @start="startMeasurement" />
    <measurement-container
      @handleEvent="handleEvent"
      :userInfo="user"
      ref="measurement"
    />
    <span
      class="toggle"
      :style="{
        background: `${!isMaskEnabled ? enableIcon : disableIcon}`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: !isMaskEnabled ? 'rgb(255, 255, 255)' : 'rgb(255, 255, 255)',
      }"
      @click="handleToggle"
    >
    </span>
    <span
      class="userInfo"
      v-if="user.username"
      :class="{
        black: isMaskEnabled,
        white: !isMaskEnabled,
      }"
      >{{ user.username || "" }}</span
    >
  </div>
</template>

<script>
import { FaceController } from "../../utils/FaceController.js";
import { MeasurementCategory } from "xiaoyang-health-measurement";
import Cookies from "js-cookie";
import { Icon, Overlay, Loading } from "vant";
import { showDialog } from "vant";
import "vant/lib/dialog/style/index";
import MeasurementContainer from "../../components/measurement/index.vue";
import { disableIcon, enableIcon, scannerIcon } from "./icon.js";
import MaskPage from "./mask.vue";
const DANGER_LEVEL_COLORS = {
  1: "#4CAF50",
  2: "#8BC34A",
  3: "#FFC107",
  4: "#FF9800",
  5: "#F44336",
};
export default {
  components: {
    [Icon.name]: Icon,
    [Overlay.name]: Overlay,
    [Loading.name]: Loading,
    MeasurementContainer,
    MaskPage,
    // ButtonContainer
  },
  // components: {},
  data() {
    return {
      disableIcon,
      enableIcon,
      scannerIcon,
      faceController: null,
      loading: false,
      mask: true,
      isMaskEnabled: false,
      measurementId: "",
      completed: false, // 测量是否完成
      progressCompleted: false, // 进度条是否完成
      user: {}, // 用户信息
    };
  },
  mounted() {
    // console.log(import.meta.env.MODE)
  },
  async beforeUnmount() {
    this.dispose();
  },
  methods: {
    handleToggle() {
      //是否显示弹窗
      this.isMaskEnabled = !this.isMaskEnabled;
      this.faceController.toggleMask();
    },
    handleEvent(event, params) {
      switch (event) {
        case "startProgress":
          this.startProgress(params); // 进度条
          break;
        case "updateMessage":
          this.updateMessage(params);
          break;
        case "dispose":
          this.dispose();
          break;
        case "completed":
          this.completed = true;
          this.toRouter();
          break;
        case "chunkReportGenerated":
          try {
            if (
              this.faceController &&
              typeof this.faceController.showHeart === "function"
            ) {
              this.faceController.showHeart(params?.hrbpm || 0);
            }
          } catch (error) {
            console.log("chunkReportGenerated handle", error);
          }
          break;
        default:
          break;
      }
    },
    toRouter() {
      // 进度条已走完 测量已完成 测量ID存在
      if (this.progressCompleted && this.completed && this.measurementId) {
        this.$router.push({ name: "sao2", query: { measurementId: this.measurementId } });
      }
    },
    dispose() {
      //结束测量
      try {
        this.mask = true;
        this.loading = false;
        this.isMaskEnabled = false;
        this.progressCompleted = false;
        this.completed = false;
        this.measurementId = "";
        // 清理控制器
        if (this.faceController) {
          this.faceController.dispose();
          this.faceController = null;
        }
      } catch (error) {
        console.log(error);
      }
    },
    updateMessage({ level, message }) {
      if (!this.faceController || !this.faceController.isReady()) return;
      try {
        // 更新状态
        this.faceController.setText(
          level > 0 ? "人脸晃动，请保持静止" : "测量中，请保持静止"
        );
        this.faceController.setCornerMarkerColor(DANGER_LEVEL_COLORS[level]);
      } catch (error) {
        console.log(error);
      }
    },
    listenerCornerMarkerEvent() {
      const cornerMarker = this.faceController.getCornerMarker();
      if (!cornerMarker) return;

      // 倒计时开始
      cornerMarker.on("countdownStarted", () => {
        console.log("countdownStarted");
      });
      // 倒计时进行中
      cornerMarker.on("countdownTick", () => {
        console.log("countdownTick");
      });
      // 倒计时结束
      cornerMarker.on("countdownFinished", async () => {
        console.log("倒计时结束！");
        this.handleStartMeasurement();
        // this.faceController.showHeart(10);
      });

      // getProfile
      // 遮罩层 是否显示
      cornerMarker.on("maskToggled", (isMaskEnabled) => {
        this.isMaskEnabled = isMaskEnabled;
      });
      // 测量进度是否完成
      cornerMarker.on("progressCompleted", () => {
        this.faceController.setText("测量完成，计算中请稍候...");
        this.progressCompleted = true;
        this.toRouter();
        if (this.completed) {
        } else {
          this.faceController.startLoading();
        }
      });
    },
    async startProgress({ measurementId }) {
      try {
        this.measurementId = measurementId;
        await this.faceController.startProgress();
      } catch (error) {
        console.log("startProgress", error);
      }
    },
    async startMeasurement() {
      this.loading = true;
      try {
        // 初始化人脸控制器
        this.faceController = new FaceController();
        const { FaceDetector, CornerMarker } = await this.faceController.initialize({
          videoId: "mediapipe-video",
          canvasId: "mediapipe-canvas",
          isMaskEnabled: this.isMaskEnabled,
          maskColor: "rgba(255, 255, 255, 1)",
          duration: 27000,
        });
        this.faceController.showHeart("");

        FaceDetector.on("cameraStarted", () => {
          this.mask = false;
          this.loading = false;
          this.faceController.startCountdown();
          this.bindVideoFitEvents();
          this.$nextTick(() => this.applyFitMode());
        });
        FaceDetector.on("cameraError", (e) => {
          showDialog({
            title: "系统消息",
            type: "fail",
            message: e?.message,
          });
        });
        FaceDetector.on("permissionDenied", (e) => {
          showDialog({
            title: "系统消息",
            type: "fail",
            message: e?.message,
          });
        });
        await this.listenerCornerMarkerEvent();
      } catch (error) {
        this.dispose();
        console.log(error);
      }
    },
    applyFitMode() {
      const video = document.getElementById("mediapipe-video");
      const canvas = document.getElementById("mediapipe-canvas");
      if (!video || !video.videoWidth || !video.videoHeight) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const screenRatio = vw / vh;
      const videoRatio = video.videoWidth / video.videoHeight;

      const addMode = (el, mode) => {
        el.classList.remove("fit-width", "fit-height");
        el.classList.add(mode);
      };

      const mode = videoRatio > screenRatio ? "fit-height" : "fit-width";
      addMode(video, mode);
      addMode(canvas, mode);
    },
    bindVideoFitEvents() {
      const video = document.getElementById("mediapipe-video");
      if (!video) return;
      video.removeEventListener("loadedmetadata", this.applyFitMode);
      video.addEventListener("loadedmetadata", this.applyFitMode);
      window.removeEventListener("resize", this.applyFitMode);
      window.addEventListener("resize", this.applyFitMode);
    },
    async handleStartMeasurement() {
      try {
        // 确保 CornerMarker 存在且可用
        if (this.faceController && this.faceController.isReady()) {
          this.faceController.setText("测量环境检测中，请稍等… ");
          // console.log("setText 已调用");
        } else {
          console.warn("faceController 未准备好，无法设置文本");
        }
        // 测量服务令牌(token)需要通过请求许可证(APP_ID/APP_KEY) 认证API获得
        // 用户认证 | 心健康测量SDK产品文档  https://measurement.xymind.cn/docs/api/authorization.html
        const measurement_token = import.meta.env.VITE_TOKEN;
        Cookies.set("Measurement-Token", measurement_token);
        let categories = 1;
        await this.$refs.measurement.handleStartMeasurement(
          measurement_token,
          MeasurementCategory.ALL
        );
      } catch (error) {
        console.log(error);
        this.dispose();
        this.$refs.measurement.interrupt();
      }
    },
  },
};
</script>
<style scoped lang="scss">
.mediapipe-image {
  position: fixed;
  left: 0;
  width: 200px;
  z-index: 20;
}
.toggle {
  position: fixed;
  left: 20px;
  bottom: 60px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-size: 20px 20px;
  z-index: 11;
  &::after {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }
}
.userInfo {
  position: absolute;
  right: 20px;
  bottom: 60px;
  height: 40px;
  max-width: 200px;
  display: flex;
  padding: 0 20px;
  align-items: center;
  border-radius: 20px;
  z-index: 11;
  white-space: nowrap; /* 确保文本不换行 */
  overflow: hidden; /* 隐藏超出容器的文本 */
  text-overflow: ellipsis; /* 超出的文本显示为省略号 */
  &.black {
    background: #000;
    color: #fff;
  }
  &.white {
    background: #fff;
    color: #000;
  }
}
</style>
