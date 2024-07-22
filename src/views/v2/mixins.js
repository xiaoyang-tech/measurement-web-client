export default {
  data() {
    return {
      Measurement: null,
      measurementId: null, // measurementId
      Duration: 27, // 时常
      MaxMeasureTime: 60,
      StartMeasurementTime: null,
    }
  },
  methods: {
    dispose() {
      // 关闭摄像头
      this.camera.stop()
      this.loading = false
      this.consumerTimerId && cancelAnimationFrame(this.consumerTimerId)
      if (document.getElementById('canvas')) {
        document.getElementById('canvas').getContext('2d').clearRect(0, 0, this.screenWidth, this.screenWidth)
      }
      this.measurementId = ''
    }
  }
}
