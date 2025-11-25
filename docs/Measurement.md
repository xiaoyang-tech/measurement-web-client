### Measurement 对接文档

#### 功能概述

Measurement 负责采集视频帧、与后端实时交互，产出阶段性心率与完整测量报告，并暴露测量生命周期事件。

#### 安装与引入

```javascript
import { Measurement } from 'xiaoyang-health-measurement'
```

#### 构造与初始化

```javascript
const measurement = new Measurement(
  {
    videoId: 'mediapipe-video',     // 关联的视频元素 id（必填）
    token: 'MEASUREMENT_TOKEN'      // 鉴权 token（必填）
  },
  // 可选分类（位掩码），不传则后端决定
)
await measurement.initialize()
```

鉴权 token 一般通过人脸截图 base64 向后端换取。

#### 事件订阅

```javascript
measurement.addEventListener('started', (sender, { measurementId }) => {
  console.log('started', measurementId)
})

measurement.addEventListener('chunkReportGenerated', (sender, result) => {
  // 阶段性心率：兼容 hrbpm / hrBpm
  const bpm = result.hrbpm ?? result.hrBpm
  console.log('HR chunk', bpm)
})

measurement.addEventListener('wholeReportGenerated', (sender, report) => {
  console.log('whole report', report)
})

measurement.addEventListener('collected', () => {
  console.log('video collected')
})

measurement.addEventListener('interrupted', () => {
  console.log('interrupted')
})

measurement.addEventListener('crashed', (sender, e) => {
  console.error('crashed', e?.message)
})
```

#### 常用方法

- initialize(): Promise<void> — 建立连接与内部准备
- interrupt(): void — 主动终止测量
- addEventListener(event, handler): void — 订阅事件

#### 事件说明

- started: 返回测量 ID（{ measurementId }）
- chunkReportGenerated: 阶段性测量结果（心率等），字段兼容 hrbpm / hrBpm
- wholeReportGenerated: 完整测量报告（protobuf 反序列化对象）
- collected: 分片视频已发送完毕
- interrupted: 测量中断与清理
- crashed: 异常（{ message }）

#### 典型流程

1) 页面准备 `<video id="mediapipe-video" />`
2) 拿到 token 后 `new Measurement({...}).initialize()`
3) 订阅 started/chunkReportGenerated/wholeReportGenerated 等事件
4) UI 显示阶段性心率、落库完整报告
5) 结束时调用 interrupt() 或在路由切换时清理

#### 常见问题

- “字段名不一致”：不同服务版本心率字段为 hrbpm 或 hrBpm，建议代码兼容读取
- “为什么没有阶段性心率？”：检查 token 是否有效、网络是否可达、视频帧是否正常入队（通常由内部控制）
