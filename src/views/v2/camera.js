class camera {
  constructor({ canvas_out, screenWidth = null, onFrame = null }) {
    this._request_id = 0;
    this.onFrame = onFrame
    if (screenWidth) {
      this.screenWidth = screenWidth
        // (document.body.clientWidth > 480 ? 480 : document.body.clientWidth) - 40
    } else {
      this.screenWidth = (document.body.clientWidth > 480 ? 480 : document.body.clientWidth) - 40
    }
    this._webcam = document.createElement("video");
    this._webcam.setAttribute('webkit-playsinline', 'webkit-playsinline');
    this._webcam.setAttribute('playsinline', true);
    this.canvas = canvas_out;
    this._sn = 0;
    this.doFrame = this.doFrame.bind(this);
    this.start = 0;
    this.startTimestamp = 0;
    this._orientation = ""
    this.deviceType = ""
    this._stream = null;
    this._shouldSendData = false;
  }
  get shouldSendData() {
    return this._shouldSendData;
  }

  set shouldSendData(value) {
    this._shouldSendData = value;
    if (this._shouldSendData) {
      console.log('shouldSendData is now true');
    }
  }
  open() {
    this.deviceType = this.checkDevice();
    const _videoConstraints = {
      video: {
        width: { ideal: this.screenWidth, min: this.screenWidth, max: 1920 },
        height: { ideal: this.screenWidth, min: this.screenWidth, max: 1080 },
        frameRate: { ideal: 30, max: 30 },
        facingMode: { ideal: 'user' }
      }
    };
    return new Promise((resolve, reject) => {
      window.navigator.mediaDevices.getUserMedia(_videoConstraints).then((mediaStream) => {
        this._webcam.srcObject = mediaStream
        this._stream = mediaStream.getTracks()[0];
        this._webcam.play().then(() => {
          this.doFrame();
          resolve({
            width: this._webcam.videoWidth, height: this._webcam.videoHeight,orientation:this._orientation
          })
        }).catch((e) => { reject(e) })

      }).catch((e) => { reject(e) })
    })
  }

  stop() {
    this._sn = 0
    this.start = 0
    this.startTimestamp = 0;
    this.shouldSendData = false;
    cancelAnimationFrame(this._request_id);
    this._webcam.pause();
    if (this._stream) {
      this._stream.stop();
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清空画布
    }
  }
  doFrame(timestamp) {
    if (timestamp - this.start >= 40) {
      this.start = timestamp;
      cancelAnimationFrame(this._request_id);
      const ctx = this.canvas.getContext('2d');
      var draw_ratio = (document.body.clientWidth > 480 ? 480 : document.body.clientWidth) - 40/ this._webcam.videoWidth -1.5
      if (draw_ratio <= 1)
        draw_ratio = 1
      else if(draw_ratio >= 3)
        draw_ratio = 3
      ctx.canvas.style.width  = this.screenWidth  + "px";
      ctx.canvas.style.height = this.screenWidth + "px";
      ctx.setTransform(-1,0,0,1,this.screenWidth,0);
      ctx.drawImage(this._webcam, 0, 0, this.screenWidth, this.screenWidth)
      if (this._shouldSendData) {
        if (this._sn === 0) {
          console.log("开始记录第一帧时间")
          this.startTimestamp = Date.now()
        }
        this.onFrame(Object.assign({}, {
          camera: this._webcam,
          // ctx: ctx,
          timestamp: Date.now(),
          sn: this._sn,
          startTime: this.startTimestamp,
        }));
        // console.log('开始时间:', this.startTimestamp , '当前时间:', Date.now() , '已经测量时间', `${(Date.now() - this.startTimestamp) / 1000}S`, '当前帧:', this._sn, '视频帧时间:', timestamp)
        this._sn++
      }
    }
    this._request_id = requestAnimationFrame(this.doFrame);
  }

  doOnOrientationChange() {
    switch(window.orientation) {
      case 90:
        this._orientation = "landscape"
        break
      case -90:
        this._orientation = "landscape"
        break;
      case 0:
        this._orientation = "portrait"
        break
      case 180:
        this._orientation = "portrait"
        break;
      default:
        break;
    }
  }

  checkDevice(){
    {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
      }
      else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
      }
      return "desktop";
    }
  }
}
// export const camera = camera
export default camera
