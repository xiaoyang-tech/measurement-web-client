// symbol
// lt 小于
// le 小于等于
// eq 等于
// ne 不等于
// ge 大于等于
// gt 大于

export const computedSymbol = (symbol, min, max, score) => {
  if (symbol === 'le') {
    return score >= min && score <= max
  }
  return score >= min && score < max
}
export const reportConfig = [
  {
    label: '综合心健康风险',
    value: 'score',
    Category: 0,
    id: 0,
    data: [
      { min: 0, max: 60, symbol: 'lt', total: 100, color: '#FF5252', label: '重度不健康' },
      { min: 60, max: 70, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
      { min: 70, max: 80, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
      { min: 80, max: 90, symbol: 'lt', total: 100, color: '#85c9fa', label: '良好' },
      { min: 90, max: 100, symbol: 'le', total: 100, color: '#6EDAA9', label: '优秀' }
    ],
    trend: 'score',
    advice: 'score',
    status: 'status',
    terms: 'HappyCat.Term.Physiology.Score'
  },
  {
    label: '心率',
    value: 'hrbpm',
    Category: 1,
    id: 1,
    data: [
      { min: 40, max: 60, symbol: 'lt', total: 160, color: '#FCCE57', label: '轻度不健康' },
      { min: 60, max: 100, symbol: 'le', total: 160, color: '#6EDAA9', label: '优秀' },
      { min: 100, max: 160, symbol: 'le', total: 160, color: '#FCCE57', label: '轻度不健康' }
    ],
    trend: 'hrbpm',
    advice: 'hrbpm',
    status: 'hR_BPM_Status',
    terms: 'HappyCat.Term.Physiology.HR_BPM'
  },
  {
    label: '心率变异性',
    value: 'hrv',
    Category: 2,
    id: 2,
    data: [
      { min: 0, max: 50, symbol: 'lt', total: 300, color: '#FCCE57', label: '轻度不健康' },
      { min: 50, max: 200, symbol: 'le', total: 300, color: '#6EDAA9', label: '优秀' },
      { min: 200, max: 300, symbol: 'le', total: 300, color: '#FCCE57', label: '轻度不健康' }
    ],
    trend: 'HRV',
    advice: 'HRV',
    status: 'hrvStatusDisplayName',
    terms: 'HappyCat.Term.SaO2.HRV'
  },
  {
    label: '房颤',
    value: 'af',
    Category: 11,
    id: 11,
    data: [],
    trend: 'af',
    advice: 'af',
    status: 'af',
    terms: 'HappyCat.Term.Af'
  },
    {
      label: '收缩压',
      value: 'bpsystolic',
      Category: 4,
      id: 4,
      data: [
        { min: 70, max: 90, symbol: 'lt', total: 170, color: '#FCCE57', label: '轻度不健康' },
        { min: 90, max: 130, symbol: 'le', total: 170, color: '#6EDAA9', label: '优秀' },
        { min: 130, max: 140, symbol: 'le', total: 170, color: '#FCCE57', label: '轻度不健康' },
        // { min: 140, max: 100, symbol: '', total: 170, color: '#FCCE57', label: '轻度不健康' },
        { min: 140, max: 170, symbol: 'le', total: 170, color: '#FF5252', label: '重度不健康' }
      ],
      trend: 'bpsystolic',
      advice: 'bpsystolic',
      status: 'bP_SYSTOLIC_Status',
      terms: 'HappyCat.Term.Physiology.BP_SYSTOLIC'
    },

    {
      label: '舒张压',
      value: 'bpdiastolic',
      Category: 3,
      id: 3,
      data: [
        { min: 50, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
        { min: 60, max: 80, symbol: 'le', total: 100, color: '#6EDAA9', label: '优秀' },
        // { min: 80, max: 90, symbol: '', total: 100, color: '#85c9fa', label: '良好' },
        { min: 80, max: 90, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
        { min: 90, max: 100, symbol: 'le', total: 100, color: '#FF5252', label: '重度不健康' }
      ],
      trend: 'bpdiastolic',
      advice: 'bpdiastolic',
      status: 'bP_DIASTOLIC_Status',
      terms: 'HappyCat.Term.Physiology.BP_DIASTOLIC'
    },
    {
      label: '血氧饱和度',
      value: 'spo2h',
      Category: 10,
      id: 10,
      data: [
        { min: 60, max: 93, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
        { min: 93, max: 100, symbol: 'le', total: 100, color: '#6EDAA9', label: '优秀' }
      ],
      trend: 'spo2h',
      advice: 'spo2h',
      status: 'saO2StatusDisplayName',
      terms: 'HappyCat.Term.SaO2'
    },
    {
    label: '体重指数',
    value: 'bmi',
    Category: 13,
    id: 13,
    data: [
      { min: 15, max: 18.5, symbol: 'lt', total: 40, color: '#FCCE57', label: '轻度不健康' },
      { min: 18.5, max: 25, symbol: 'lt', total: 40, color: '#6EDAA9', label: '优秀' },
      { min: 25, max: 30, symbol: 'lt', total: 40, color: '#FCCE57', label: '轻度不健康' },
      { min: 30, max: 35, symbol: 'lt', total: 40, color: '#FC9557', label: '中度不健康' },
      { min: 35, max: 40, symbol: 'le', total: 40, color: '#FF5252', label: '重度不健康' }
    ],
    trend: 'BMI',
    advice: 'BMI',
    status: 'bmI_Status',
    terms: 'HappyCat.Term.Physiology.BMI'
  },
  {
    label: '皮肤年龄',
    value: 'age',
    Category: 12,
    id: 12,
    data: [
      { min: 0, max: 150, symbol: 'le', total: 150, color: '#85c9fa', label: '良好' }
    ],
    trend: 'age',
    advice: 'age',
    status: '',
    terms: 'HappyCat.Term.Physiology.AGE'
  },
{
    label: '血管功能',
    value: 'bptau',
    Category: 9,
    id: 9,
    data: [
      { min: 0.0, max: 0.8, symbol: 'lt', total: 3.0, color: '#FF5252', label: '重度不健康' },
      { min: 0.8, max: 1.2, symbol: 'lt', total: 3.0, color: '#FC9557', label: '中度不健康' },
      { min: 1.2, max: 1.6, symbol: 'lt', total: 3.0, color: '#FCCE57', label: '轻度不健康' },
      { min: 1.6, max: 2.2, symbol: 'lt', total: 3.0, color: '#85c9fa', label: '良好' },
      { min: 2.2, max: 3.0, symbol: 'le', total: 3.0, color: '#6EDAA9', label: '优秀' }
    ],
    trend: 'bptau',
    advice: 'bptau',
    status: 'bP_TAU_Status',
    terms: 'HappyCat.Term.Physiology.BP_TAU'
  },
{
    label: '心脏压力',
    value: 'bppp',
    Category: 8,
    id: 8,
    data: [
      { min: 3.5, max: 3.8, symbol: 'lt', total: 4.5, color: '#6EDAA9', label: '优秀' },
      { min: 3.8, max: 3.9, symbol: 'lt', total: 4.5, color: '#85c9fa', label: '良好' },
      { min: 3.9, max: 4.1, symbol: 'lt', total: 4.5, color: '#FCCE57', label: '轻度不健康' },
      { min: 4.1, max: 4.2, symbol: 'lt', total: 4.5, color: '#FC9557', label: '中度不健康' },
      { min: 4.2, max: 4.5, symbol: 'le', total: 4.5, color: '#FF5252', label: '重度不健康' }
    ],
    trend: 'bppp',
    advice: 'bppp',
    status: 'bP_RPP_Status',
    terms: 'HappyCat.Term.Physiology.BP_RPP'
  },
  {
    label: '心脏病风险',
    value: 'bpheartattack',
    Category: 5,
    id: 5,
    data: [
      { min: 0.0, max: 1.5, symbol: 'lt', total: 7.5, color: '#6EDAA9', label: '优秀' },
      { min: 1.5, max: 3.0, symbol: 'lt', total: 7.5, color: '#85c9fa', label: '良好' },
      { min: 3.0, max: 4.5, symbol: 'lt', total: 7.5, color: '#FCCE57', label: '轻度不健康' },
      { min: 4.5, max: 6.0, symbol: 'lt', total: 7.5, color: '#FC9557', label: '中度不健康' },
      { min: 6.0, max: 7.5, symbol: 'le', total: 7.5, color: '#FF5252', label: '重度不健康' }
    ],
    trend: 'bpheartattack',
    advice: 'bpheartattack',
    status: 'bP_HEART_ATTACK_Status',
    terms: 'HappyCat.Term.Physiology.BP_HEART_ATTACK'
  },
  {
    label: '中风风险',
    value: 'bpstroke',
    Category: 7,
    id: 7,
    data: [
      { min: 0.0, max: 1.5, symbol: 'lt', total: 7.5, color: '#6EDAA9', label: '优秀' },
      { min: 1.5, max: 3.0, symbol: 'lt', total: 7.5, color: '#85c9fa', label: '良好' },
      { min: 3.0, max: 4.5, symbol: 'lt', total: 7.5, color: '#FCCE57', label: '轻度不健康' },
      { min: 4.5, max: 6.0, symbol: 'lt', total: 7.5, color: '#FC9557', label: '中度不健康' },
      { min: 6.0, max: 7.5, symbol: 'le', total: 7.5, color: '#FF5252', label: '重度不健康' }
    ],
    trend: 'bpstroke',
    advice: 'bpstroke',
    status: 'bP_STROKE_Status',
    terms: 'HappyCat.Term.Physiology.BP_STROKE'
  },
  {
    label: '心血管病风险',
    value: 'bpcvd',
    Category: 6,
    id: 6,
    data: [
      { min: 0.0, max: 3.0, symbol: 'lt', total: 15.00, color: '#6EDAA9', label: '优秀' },
      { min: 3.0, max: 6.0, symbol: 'lt', total: 15.00, color: '#85c9fa', label: '良好' },
      { min: 6.0, max: 9.0, symbol: 'lt', total: 15.00, color: '#FCCE57', label: '轻度不健康' },
      { min: 9.0, max: 12.0, symbol: 'lt', total: 15.00, color: '#FC9557', label: '中度不健康' },
      { min: 12.0, max: 15.0, symbol: 'le', total: 15.00, color: '#FF5252', label: '重度不健康' }
    ],
    trend: 'bpcvd',
    advice: 'bpcvd',
    status: 'bP_CVD_Status',
    terms: 'HappyCat.Term.Physiology.BP_CVD'
  },

  
  {
    label: '情绪综合分',
    value: 'emotionscore',
    Category: 20,
    id: 20,
    data: [
      { min: 0, max: 20, symbol: 'lt', total: 100, color: '#FF5252', label: '重度不健康' },
      { min: 20, max: 40, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
      { min: 40, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
      { min: 60, max: 80, symbol: 'lt', total: 100, color: '#6EDAA9', label: '优秀' },
      { min: 80, max: 100, symbol: 'le', total: 100, color: '#85c9fa', label: '良好' },
    ],
    trend: 'emotionscore',
    advice: 'emotionscore',
    status: 'emotionscore',
    terms: ''
  },
  {
    label: '攻击性(负向)',
    value: 'aggressivity',
    Category: 21,
    id: 21,
    data: [
      { min: 0, max: 20, symbol: 'lt', total: 100, color: '#85c9fa', label: '良好' },
      { min: 20, max: 40, symbol: 'lt', total: 100, color: '#6EDAA9', label: '优秀' },
      { min: 40, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
      { min: 60, max: 80, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
      { min: 80, max: 100, symbol: 'le', total: 100, color: '#FF5252', label: '重度不健康' },
    ],
    trend: 'aggressivity',
    advice: 'aggressivity',
    status: 'aggressivity',
    terms: ''
  },
  {
    label: '焦虑度(负向)',
    value: 'anxiety',
    Category: 22,
    id: 22,
    data: [
      { min: 0, max: 20, symbol: 'lt', total: 100, color: '#85c9fa', label: '良好' },
      { min: 20, max: 40, symbol: 'lt', total: 100, color: '#6EDAA9', label: '优秀' },
      { min: 40, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
      { min: 60, max: 80, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
      { min: 80, max: 100, symbol: 'le', total: 100, color: '#FF5252', label: '重度不健康' },
    ],
    trend: 'anxiety',
    advice: 'anxiety',
    status: 'anxiety',
    terms: ''
  },
  // {
  //   label: '压抑度(负向)',
  //   value: 'depression',
  //   Category: 23,
  //   id: 23,
  //   data: [
  //     { min: 0, max: 20, symbol: 'lt', total: 100, color: '#6EDAA9', label: '良好' },
  //     { min: 20, max: 40, symbol: 'lt', total: 100, color: '#85c9fa', label: '优秀' },
  //     { min: 40, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
  //     { min: 60, max: 80, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
  //     { min: 80, max: 100, symbol: 'le', total: 100, color: '#FF5252', label: '重度不健康' },
  //   ],
  //   trend: 'depression',
  //   advice: 'depression',
  //   status: 'depression',
  //   terms: ''
  // },
  {
    label: '活力度(正向)',
    value: 'vitality',
    Category: 24,
    id: 24,
    data: [
      { min: 0, max: 20, symbol: 'lt', total: 100, color: '#FF5252', label: '重度不健康' },
      { min: 20, max: 40, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
      { min: 40, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
      { min: 60, max: 80, symbol: 'lt', total: 100, color: '#6EDAA9', label: '优秀' },
      { min: 80, max: 100, symbol: 'le', total: 100, color: '#85c9fa', label: '良好' },
    ],
    trend: 'vitality',
    advice: 'vitality',
    status: 'vitality',
    terms: ''
  },
  // {
  //   label: '积极性(正向)',
  //   value: 'positivity',
  //   Category: 25,
  //   id: 25,
  //   data: [
  //     { min: 0, max: 20, symbol: 'lt', total: 100, color: '#FF5252', label: '重度不健康' },
  //     { min: 20, max: 40, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
  //     { min: 40, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
  //     { min: 60, max: 80, symbol: 'lt', total: 100, color: '#6EDAA9', label: '优秀' },
  //     { min: 80, max: 100, symbol: 'le', total: 100, color: '#85c9fa', label: '良好' },
  //   ],
  //   trend: 'positivity',
  //   advice: 'positivity',
  //   status: 'positivity',
  //   terms: ''
  // },
  {
    label: '抑郁度(负向)',
    value: 'suppression',
    Category: 26,
    id: 26,
    data: [
      { min: 0, max: 20, symbol: 'lt', total: 100, color: '#85c9fa', label: '良好' },
      { min: 20, max: 40, symbol: 'lt', total: 100, color: '#6EDAA9', label: '优秀' },
      { min: 40, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
      { min: 60, max: 80, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
      { min: 80, max: 100, symbol: 'le', total: 100, color: '#FF5252', label: '重度不健康' }
    ],
    trend: 'suppression',
    advice: 'suppression',
    status: 'suppression',
    terms: ''
  },
  {
    label: '疲劳度(负向)',
    value: 'fatigue',
    Category: 27,
    id: 27,
    data: [
      { min: 0, max: 20, symbol: 'lt', total: 100, color: '#6EDAA9', label: '良好' },
      { min: 20, max: 40, symbol: 'lt', total: 100, color: '#85c9fa', label: '优秀' },
      { min: 40, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
      { min: 60, max: 80, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
      { min: 80, max: 100, symbol: 'le', total: 100, color: '#FF5252', label: '重度不健康' }
    ],
    trend: 'fatigue',
    advice: 'fatigue',
    status: 'fatigue',
    terms: ''
  },
  {
    label: '压力度(负向)',
    value: 'msi',
    Category: 28,
    id: 28,
    data: [
      { min: 0, max: 20, symbol: 'lt', total: 100, color: '#85c9fa', label: '良好' },
      { min: 20, max: 40, symbol: 'lt', total: 100, color: '#6EDAA9', label: '优秀' },
      { min: 40, max: 60, symbol: 'lt', total: 100, color: '#FCCE57', label: '轻度不健康' },
      { min: 60, max: 80, symbol: 'lt', total: 100, color: '#FC9557', label: '中度不健康' },
      { min: 80, max: 100, symbol: 'le', total: 100, color: '#FF5252', label: '重度不健康' }
    ],
    trend: 'MSI',
    advice: 'MSI',
    status: 'msI_Status',
    terms: 'HappyCat.Term.Physiology.MSI'
  },
]
