### CornerMarker 对接文档

#### 功能概述
CornerMarker 负责在人脸测量流程中绘制可视化引导，包括四角取景框、遮罩、进度条、倒计时、加载动画，以及可选的底部心形显示。通过事件系统对外暴露过程状态。

#### 安装与引入
```javascript
import { CornerMarker } from 'xiaoyang-health-measurement'
```

#### 构造与初始化
```javascript
const marker = new CornerMarker({
  canvasId: 'mediapipe-canvas',    // 画布元素 id（必填）
  isMaskEnabled: false,            // 是否开启遮罩（默认 false）
  maskColor: 'rgba(0, 0, 0, 0.65)',// 遮罩颜色
  duration: 15000,                  // 进度条总时长 ms（默认 15000）
  allowHeartWhenCompleted: false,  // 完成后是否继续显示心形

  // UI 可选项（均有默认值）
  designWidth: 280,
  designHeight: 360,
  minPadding: 40,
  markSize: 30,
  lineWidth: 5,
  markColor: 'rgba(76, 175, 80, 0.9)',
  cornerRadius: 3,
  progressBarHeight: 14,
  progressBarMargin: 50,
  progressBarRadius: 8,
  text: '请保持面部在框内',
  textColor: '#333333',
  textSize: 16
})
```

页面需存在 `<canvas id="mediapipe-canvas" />`，并确保尺寸可随窗口变化自适应。

#### 常用方法
- initialize：无显式初始化方法，构造时即完成内部初始化与渲染
- startProgress(): Promise<boolean> — 开始进度动画（含扫描光带加载）
- pauseProgress(): void — 暂停进度
- resetProgress(): void — 重置进度、停止动画并清空状态
- startCountdown(seconds=3): void — 启动中间圆形倒计时（默认 3s）
- startLoading(): void — 显示圆环加载动画（居中）
- stopLoading(): void — 停止加载动画
- toggleMask(): void — 切换遮罩显示
- setCornerMarkerColor(color): void — 动态修改四角取景框颜色
- setText(text): void — 动态修改顶部提示文案
- showHeart(value): void — 底部显示心形与数值（只接收数值字符串/数字）
- clearHeart(): void — 清除心形
- getCurrentLayout(): { left,right,top,bottom } — 当前取景区域位置
- on(event, handler): void — 订阅事件
- off(event, handler): void — 取消订阅

#### 事件
- progressStarted: 进度开始
- progressUpdated(progress: number 0~1): 进度变化
- progressPaused(progress): 进度暂停
- progressCompleted: 进度完成
- completionEffectShown: 完成态渲染完成
- progressReset: 进度重置
- maskToggled(isEnabled: boolean): 遮罩切换
- faceDetected / faceLost: 预留人脸进入/离开（如对接外部事件）
- countdownStarted(total: number)
- countdownTick(left: number)
- countdownFinished

示例：
```javascript
marker.on('progressUpdated', p => {
  console.log('progress', Math.round(p * 100) + '%')
})
```

#### 使用建议
- 进度条显示通常与测量时长一致，可通过 `duration` 配置
- 启用遮罩时可配合文案 `setText()` 指引用户对齐
- 若接入阶段性心率，可用 `showHeart(bpm)` 同步视觉反馈；若在完成后仍需展示，配置 `allowHeartWhenCompleted: true`

#### 与 FaceDetector/Measurement 配合
1) 使用 FaceDetectorMarker 打开摄像头、做人脸检测与截图
2) 进入测量前：`marker.setText('请对齐并保持静止'); marker.startCountdown(3)`
3) 倒计时结束后：`marker.startProgress()` 同步 Measurement 启动
4) Measurement 阶段性心率：`marker.showHeart(bpm)`；完成时根据需要 `clearHeart()` 或保留
5) 结束/中断：`marker.resetProgress()` 并清理页面状态


