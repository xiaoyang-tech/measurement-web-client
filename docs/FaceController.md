### FaceController 对接文档

#### 功能概述
FaceController 封装了 `FaceDetectorMarker` 与 `CornerMarker` 的初始化、组合与统一控制，便于业务以更少代码完成摄像头拉起、取景 UI、倒计时/进度、心形显示等流程。

#### 安装与引入
```javascript
import { FaceController } from 'xiaoyang-health-measurement'
```

#### 构造与初始化
```javascript
const fc = new FaceController()
await fc.initialize({
  videoId: 'mediapipe-video',      // <video> 元素 id（必填）
  canvasId: 'mediapipe-canvas',    // <canvas> 元素 id（必填）
  isMaskEnabled: false,            // CornerMarker 遮罩
  maskColor: 'rgba(255,255,255,0.6)',
  duration: 27000,                 // 进度总时长 ms（默认 27000）
  allowHeartWhenCompleted: false   // 完成后是否继续显示心形
})

// 可通过 getter 获取内部实例
const detector = fc.getFaceDetector()
const marker = fc.getCornerMarker()
```

页面需存在 `<video id="mediapipe-video" />` 与 `<canvas id="mediapipe-canvas" />`。

#### 常用方法
- initialize(options): Promise<{ FaceDetector, CornerMarker }>
- getFaceDetector(): FaceDetectorMarker|null
- getCornerMarker(): CornerMarker|null
- toggleMask(): void — 切换遮罩
- setText(text): void — 设置 UI 文案
- startCountdown(): void — 启动倒计时（默认 3s）
- startProgress(): Promise<boolean> — 开始进度
- resetProgress(): void — 重置进度
- startLoading(): void — 中心加载动画
- showHeart(value): void — 底部心形显示数值
- clearHeart(): void — 清除心形
- setAllowHeartWhenCompleted(allow): void — 完成后是否继续显示心形
- setCornerMarkerColor(color): void — 修改角标颜色
- getFaceBase64(): Promise<string> — 从 `FaceDetectorMarker` 获取人脸截图
- on(event, cb): void — 统一事件订阅（会同时注册到内部两个实例）
- off(event, cb): void — 统一事件移除
- dispose(): void — 清理内部实例与状态
- isReady(): boolean — 是否已初始化完成

事件名参考各组件：
- CornerMarker: progressStarted/progressUpdated/progressPaused/progressCompleted/completionEffectShown/progressReset/maskToggled/countdownStarted/countdownTick/countdownFinished
- FaceDetectorMarker: cameraStarted/cameraStopped/cameraError 等（按实际暴露）

#### 典型流程
```javascript
const fc = new FaceController()
await fc.initialize({ videoId: 'mediapipe-video', canvasId: 'mediapipe-canvas' })

// 1) 前置引导
fc.setText('请正对摄像头，保持静止')
fc.startCountdown()

// 2) 倒计时结束后开始测量（示例：3s 后）
fc.on('countdownFinished', async () => {
  await fc.startProgress()
  // 同步 Measurement.initialize() 与 start 逻辑
})

// 3) 阶段性心率显示
// measurement.addEventListener('chunkReportGenerated', (_, r) => fc.showHeart(r.hrbpm ?? r.hrBpm))

// 4) 流程结束或中断
// fc.resetProgress(); fc.clearHeart();
```


