### FaceDetectorMarker 对接文档

#### 功能概述
FaceDetectorMarker 负责摄像头拉起与人脸检测，提供获取人脸截图（base64）等能力，常用于换取测量 token 或做前置校验。

#### 安装与引入
```javascript
import { FaceDetectorMarker } from 'xiaoyang-health-measurement'
```

#### 构造与初始化
```javascript
const face = new FaceDetectorMarker({
  videoId: 'mediapipe-video', // 绑定的视频元素 id（必填）
})
await face.initialize()
```

#### 获取人脸截图
```javascript
const faceBase64 = await face.getFaceBase64()
// 将 faceBase64 发送至后端换取 Measurement 所需 token
```

#### 事件（如已暴露）
- cameraStarted: 摄像头就绪
- cameraStopped / cameraError: 摄像头关闭或异常

示例：
```javascript
face.on?.('cameraStarted', () => {
  console.log('camera started')
})
```

#### 使用建议
- 页面需存在 `<video id="mediapipe-video" />`，并允许浏览器摄像头权限
- 若需展示引导 UI 或进度条，建议与 CornerMarker/FaceController 组合使用

#### 与 Measurement 配合
1) 使用 FaceDetectorMarker 获取 faceBase64
2) 调后端换取 measurement_token
3) 用 token 初始化 Measurement 并开始测量


