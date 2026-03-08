/**
 * 健康等级颜色与标签常量
 * 统一管理项目中所有健康等级相关的颜色定义，避免多处重复硬编码
 */

// 健康等级颜色（由优到差）
export const HEALTH_COLORS = {
  EXCELLENT: '#6EDAA9',
  GOOD: '#85c9fa',
  MILD: '#FCCE57',
  MODERATE: '#FC9557',
  SEVERE: '#FF5252',
}

// 报告页底部图例配置
export const FOOTER_CONFIG = [
  { label: '优秀', color: HEALTH_COLORS.EXCELLENT },
  { label: '良好', color: HEALTH_COLORS.GOOD },
  { label: '轻度不健康', color: HEALTH_COLORS.MILD },
  { label: '中度不健康', color: HEALTH_COLORS.MODERATE },
  { label: '重度不健康', color: HEALTH_COLORS.SEVERE },
]

// ECharts 仪表盘颜色分段（四段渐变：优秀→轻度→中度→重度）
export const GAUGE_COLOR_STOPS = [
  [0.25, HEALTH_COLORS.EXCELLENT],
  [0.5, HEALTH_COLORS.MILD],
  [0.75, '#FF9732'],
  [1, '#F55B4B'],
]

// 人脸检测危险等级颜色（1-5 级）
export const DANGER_LEVEL_COLORS = {
  1: '#4CAF50',
  2: '#8BC34A',
  3: '#FFC107',
  4: '#FF9800',
  5: '#F44336',
}

// 情绪类指标名称列表（用于颜色判断分支）
export const EMOTION_LABELS = ['活力度', '开心度', '愤怒度', '悲伤度', '恐惧度']
