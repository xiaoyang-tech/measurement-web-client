import { FaceDetectorMarker } from "xiaoyang-health-measurement";
// import { FaceDetectorMarker } from "../../../websdk/src/faceDetectorMarker.js";
// ../../../../websdk/src/index.js
import { CornerMarker } from './cornerMarker'
/**
 * 人脸测量控制器
 * 封装了 FaceDetectorMarker 和 CornerMarker 的初始化和管理逻辑
 */
export class FaceController {
  constructor() {
    this.FaceDetector = null;
    this.CornerMarker = null;
    this.isInitialized = false;
  }

  /**
   * 初始化人脸检测器和角标标记器
   * @param {Object} options - 配置选项
   * @param {string} options.videoId - 视频元素ID
   * @param {string} options.canvasId - 画布元素ID
   * @param {boolean} options.isMaskEnabled - 是否启用遮罩
   * @param {string} options.maskColor - 遮罩颜色
   * @param {number} options.duration - 测量持续时间
   * @returns {Promise<void>}
   */
  async initialize(options = {}) {
    const {
      videoId = "mediapipe-video",
      canvasId = "mediapipe-canvas",
      isMaskEnabled = false,
      maskColor = 'rgba(255, 255, 255, 1)',
      duration = 30000
    } = options;

    try {
      // 初始化人脸检测器
      this.FaceDetector = await new FaceDetectorMarker({ videoId });
      
      // 初始化角标标记器
      this.CornerMarker = await new CornerMarker({
        canvasId,
        isMaskEnabled,
        maskColor,
        duration,
        allowHeartWhenCompleted: options.allowHeartWhenCompleted || false
      });

      this.isInitialized = true;
      return { FaceDetector: this.FaceDetector, CornerMarker: this.CornerMarker };
    } catch (error) {
      console.error('FaceController initialization failed:', error);
      throw error;
    }
  }

  /**
   * 获取人脸检测器实例
   * @returns {FaceDetectorMarker|null}
   */
  getFaceDetector() {
    return this.FaceDetector;
  }

  /**
   * 获取角标标记器实例
   * @returns {CornerMarker|null}
   */
  getCornerMarker() {
    return this.CornerMarker;
  }

  /**
   * 切换遮罩显示
   */
  toggleMask() {
    if (this.CornerMarker) {
      this.CornerMarker.toggleMask();
    }
  }

  /**
   * 设置角标文本
   * @param {string} text - 要显示的文本
   */
  setText(text) {
    if (this.CornerMarker) {
      this.CornerMarker.setText(text);
    } else {
      console.warn("CornerMarker 不存在，无法设置文本");
    }
  }

  /**
   * 显示底部心形（固定红色/大小100/字体白色/距底100px），仅可设置数值
   * @param {string|number} value
   */
  showHeart(value = '') {
    if (this.CornerMarker) {
      this.CornerMarker.showHeart(value);
    }
  }

  /** 清除心形 */
  clearHeart() {
    if (this.CornerMarker) {
      this.CornerMarker.clearHeart();
    }
  }

  /** 设置完成后是否允许继续显示心形 */
  setAllowHeartWhenCompleted(allow = false) {
    if (this.CornerMarker) {
      this.CornerMarker.allowHeartWhenCompleted = Boolean(allow);
      this.CornerMarker.render();
    }
  }

  /**
   * 设置角标颜色
   * @param {string} color - 颜色值
   */
  setCornerMarkerColor(color) {
    if (this.CornerMarker) {
      this.CornerMarker.setCornerMarkerColor(color);
    }
  }

  /**
   * 开始倒计时
   */
  startCountdown() {
    if (this.CornerMarker) {
      this.CornerMarker.startCountdown();
    }
  }

  /**
   * 开始进度条
   */
  async startProgress() {
    if (this.CornerMarker) {
      return await this.CornerMarker.startProgress();
    }
  }

  /**
   * 开始加载状态
   */
  startLoading() {
    if (this.CornerMarker) {
      this.CornerMarker.startLoading();
    }
  }

  /**
   * 重置进度
   */
  resetProgress() {
    if (this.CornerMarker) {
      this.CornerMarker.resetProgress();
    }
  }

  /**
   * 获取人脸base64数据
   * @returns {Promise<string>}
   */
  async getFaceBase64() {
    if (this.FaceDetector) {
      return await this.FaceDetector.getFaceBase64();
    }
    throw new Error('FaceDetector not initialized');
  }

  /**
   * 添加事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    console.log(event)
    if (this.FaceDetector && this.FaceDetector.on) {
      this.FaceDetector.on(event, callback);
    }
    if (this.CornerMarker && this.CornerMarker.on) {
      this.CornerMarker.on(event, callback);
    }
  }

  /**
   * 移除事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  off(event, callback) {
    if (this.FaceDetector && this.FaceDetector.off) {
      this.FaceDetector.off(event, callback);
    }
    if (this.CornerMarker && this.CornerMarker.off) {
      this.CornerMarker.off(event, callback);
    }
  }

  /**
   * 销毁控制器，清理资源
   */
  dispose() {
    try {
      if (this.CornerMarker) {
        this.CornerMarker.resetProgress();
        this.CornerMarker.setText("请保持面部在框内");
        this.CornerMarker = null;
      }
      
      if (this.FaceDetector) {
        this.FaceDetector = null;
      }
      
      this.isInitialized = false;
    } catch (error) {
      console.error('FaceController dispose error:', error);
    }
  }

  /**
   * 检查是否已初始化
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized && this.FaceDetector && this.CornerMarker;
  }
}

export default FaceController;
