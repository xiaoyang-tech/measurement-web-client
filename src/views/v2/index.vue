<template>
  <div class="marketing-page measurement" style="background: #C82E36">
    <div class="video-container">
      <div class="sidebar"></div>
      <div class="main" :class="{ 'main-image': true }">
        <canvas id="canvas" ref="canvas" class="canvas" :width="screenWidth" :height="screenWidth" />
      </div>
      <div class="video-mask">
        <canvas :style="{width: clientWidth + 'px', height: screenWidth + 'px'}" :width="clientWidth * 2" :height="screenWidth * 2" id="canvas-mask" />
      </div>
      <div class="sidebar"></div>
    </div>
    <div v-if="message" class="msg">
      {{ message }}
    </div>
    <template v-if="status === 0">
      <van-row gutter="20" style="padding: 0 10px">
        <van-col span="12">
          <van-button type="warning" block size="small" @click="start([MeasurementCategory.PHYSIOLOGY])" :loading="loading">生理测量</van-button>
        </van-col>
        <van-col span="12">
          <van-button type="warning" block size="small" @click="start([MeasurementCategory.EMOTION])" :loading="loading">情绪测量</van-button>
        </van-col>
      </van-row>
    </template>
    <template v-if="[3, 4, 5, 6].includes(status)">
      <div class="heart">
        <div class="rate">
          {{ hrBpm > 0 ? hrBpm : '～' }}
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { Button, Row, Col, Toast } from 'vant'
import cameras from './camera'
// import { Measurement, MeasurementCategory } from '@/utils/sdk/index'
import { Measurement, MeasurementCategory } from 'xy-health-measurement'
import mixins from './mixins'
import DrawCanvas from './draw-canvas'
let countdown = 3;

/**
 * token
 * 测量服务令牌(token)需要通过请求许可证(APP_ID/APP_KEY) 认证API获得
 * 用户认证 | 心健康测量SDK产品文档  https://measurement.xymind.cn/docs/api/authorization.html
 */

const token = ``

/**
 * status
 * 1. 3秒倒计时
 * 2. 关闭倒计时结束切已经返回测量ID 或者继续等待
 * 3. 发送测量视频帧
 * 4. 发送视频帧结束等待汇总结果
 * 5. 努力计算中
 * 6. 已返回完整报告
*/
export default {
  mixins: [mixins, DrawCanvas],
  components: {
    [Button.name]: Button,
    [Row.name]: Row,
    [Col.name]: Col,
  },
  data() {
    return {
      MeasurementCategory,
      camera: null,
      canvas: null,
      maskCanvas: null,
      hrBpm: 0, // 心率
      countdown: 3, // 倒计时
      processing: false, // 处理中
      status: 0,
      categories: [],
      message: '', // error message
      loading: false,
      clientWidth: document.body.clientWidth,
      clientHeight: document.body.clientHeight,
      screenWidth: (document.body.clientWidth > 480 ? 480 : document.body.clientWidth) - 40,
    }
  },
  async mounted() {
    this.$nextTick(() => {
      // 请正对相机。
      // 请稍候，我们正在努力为您计算中......
      this.draw('canvas-mask', true, '请正对相机。', false) // 重置画布
      this.canvas = document.getElementById('canvas')
      this.maskCanvas = document.getElementById("canvas-mask")
      this.camera = new cameras({
        canvas_out: this.canvas,
        screenWidth: this.screenWidth,
        onFrame: this.onFrame
      })

    })
  },
  async beforeDestroy() {
    this.Measurement = null
    this.close()
  },
  methods: {
    eventListener() {
      /**
       * 错误信息
       */
      this.Measurement.addEventListener('crashed', async (sender, e) => {
        const { message } = e
        console.log(e)
        this.message = message
        this.close()
      })
      this.Measurement.addEventListener('interrupted', (e) => {
        console.log(e)
        this.close()
      })
      /**
       * 返回测量ID 并开始发送测量
       */
      this.Measurement.addEventListener('started', (sender, { measurementId }) => {
        this.measurementId = measurementId
        console.log(measurementId)
        this.status = 2
      })
      /**
       * 视频传送完成
       */
      this.Measurement.addEventListener('collected', () => {
        this.status = 4 // 视频传输完整，等待汇总结果
      })
      /**
       * 监听回传的阶段性测量结果
       */
      this.Measurement.addEventListener('chunkReportGenerated', (sender, { hrbpm }) => {
        if (hrbpm > 0) {
          this.hrBpm = parseInt(hrbpm)
        }
      })
      /**
       * 完整报告
       */
      this.Measurement.addEventListener('wholeReportGenerated', (sender, data) => {
        this.status = 6
        console.log('chunkReportGenerated', data)
        Toast('已出完整报告')
      })
    },
    onFrame(params) {
      /**
       * status
       * 1. 3秒倒计时
       * 2. 关闭倒计时结束切已经返回测量ID 或者继续等待
       * 3. 发送测量视频帧
       * 4. 发送视频帧结束等待汇总结果
       * 5. 努力计算中
       * 6. 已返回完整报告
      */
      this.countdown = Math.max(0, countdown - Math.floor((params.timestamp - params.startTime) / 1000));
      // 3秒倒计时
      if (this.countdown > 0) {
        if (this.status < 1) {
          this.status = 1
        }
        this.draw('canvas-mask',true, `${this.countdown}S`)
      }
      // 倒计时结束切已经返回测量ID 则状态设置为3 
      if (this.countdown <= 0 && [1, 2].includes(this.status)) {
        this.draw('canvas-mask',false, ``, true)
        this.status = 3
      }
      // 发送视频帧
      if (this.status === 3) {
        this.Measurement.enqueue({ timestamp: Date.now(), frame: document.getElementById('canvas') })
      }
      // 4. 测量结束等待汇总阶段
      if (params.timestamp - params.startTime > (this.Duration + 3) * 1000) {
        if (this.status === 4) {
          this.draw('canvas-mask' ,true, '正在努力为您计算中......', false)
          this.status = 5
        }

        /**
         * 后续操作，可在这里完成
         */
        if (this.status === 6) {
          // 如果返回完整测量报告则主动关闭测量
          this.close('请正对屏幕保持静止')
        }
        
        // 等待时间超过预设值 则主动结束测量
        if (params.timestamp - params.startTime > this.MaxMeasureTime * 1000) {
          
          this.message = '网络请求异常，请稍后重试'
          this.close('请正对屏幕保持静止')
        }
      }
    },
    close(message = '请正对相机。', isClose = true) {
      this.camera.stop()
      this.status = 0;
      this.loading = false;
      countdown = 3;
      if (isClose) {
        this.close(message, false)
      }
      this.draw('canvas-mask', true, message) // 重置画布
    },
    
    async getFrame(delay = 300) { // 主要就是检查获取到的图片大小，如果文件小余10kB 则继续获取
      let success = false
      while (!success) {
        try {
          const frame = this.Measurement.cropFrame(document.getElementById('canvas'))
          if (frame.length / 1024 < 10) {
            throw new Error()
          } else {
            return frame
          }
        }catch (e) {
          this.draw('canvas-mask',true, '请正对屏幕保持静止')
          await new Promise(resolve => setTimeout(resolve, delay));  // 等待一段时间后重试
        }
      }
    },
    async start(categories) {
      try {
        this.draw('canvas-mask',true, '加载中...')
        this.loading = true
        this.message = ''
        this.camera.open().then(() => {
          // 测量服务令牌(token)需要通过请求许可证(APP_ID/APP_KEY) 认证API获得
          // 用户认证 | 心健康测量SDK产品文档  https://measurement.xymind.cn/docs/api/authorization.html
          this.Measurement = new Measurement(token, ...categories)
          
          this.eventListener()
          
          this.getFrame().then(() => { // 防止拿不到摄像头画面
            this.draw('canvas-mask',true, `${this.countdown}S`)
            this.camera.shouldSendData = true
            this.Measurement.start(document.getElementById('canvas')) // 创建测量
          })
        }).catch((e) => {
          console.log(e)
          this.close('请开启摄像头权限!')
        })
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../../style';
.marketing-page {
  display: flex;
  font-size: 0;
  height: 100vh;
  line-height: 0;
  flex-direction: column;
}
.video-container {
  position: relative;
  //display: flex;
  overflow: hidden;
  .video-mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 4;
    display: flex;
    justify-content: center;
  }
  ::v-deep {
    .van-circle {
      position: absolute;
      left: calc(10%);
      top: calc(10%);
      z-index: 4;
    }
  }
  .sidebar {
    flex: 1;
    background: #12184c;
  }
  .main {
    position: relative;
  }
  .main-image {
    display: flex;
    justify-content: center;
    position: relative;
  }
  .countdown-container {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    .text {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.6);
    }
  }
}
.test-next {
  font-size: 18px;
  height: 32px;
  line-height: 32px;
}
.msg {
  border-top: 1px solid #EDEDED;
  padding: 25px 0;
  font-size: 16px;
  line-height: 22px;
  color: #fff;
  margin: 30px 20px 10px 20px;
}
@keyframes scroll {
  0% {
    transform: translateY(0) scale(1);
    bottom: 0;
  }
  100% {
    transform: translateY(-10%) scale(1.2);
    bottom: 15px;
  }
}
.heart {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  .rate {
    height: 100px;
    width: 100px;
    transform: translate(-0%, -0%) scale(1);
    animation: scroll 0.8s ease-in infinite alternate;
    color: #fff;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
}
.measurement {
  //width: 100vw;
  //height: 100vh;
  box-sizing: border-box;
  //padding-top: 30px;
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .block {
      display: flex;
      align-items: center;
      padding: 10px;
      background-color: #fff;
      border-radius: 4px;
    }
  }
  //.message {
  //  position: relative;
  //  color: #000;
  //  text-align: center;
  //  font-size: 16px;
  //  margin-bottom: 30px;
  //}
}

//@keyframes firstdiv {
//  0% {
//    transform: scale(1);
//  }
//  25% {
//    transform: scale(0.9);
//  }
//  50% {
//    transform: scale(0.8);
//  }
//  75% {
//    transform: scale(0.9);
//  }
//  100% {
//    transform: scale(1);
//  }
//}
::v-deep {
  .van-button--primary {
    background: #4D9EFF;
    padding: 0 24px;
    border: 1px solid #4D9EFF;
  }
}
.btn {
  margin: 0 20px;
  background: #4D9EFF;
  padding: 12px 24px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  border-radius: 5px;
}
.m-dialog {
  display: flex;
  align-items: center;
  padding: 10px;
  flex-direction: column;
  .m-dialog-header {
    padding-top: 30px;
  }
  .m-dialog-text {
    line-height: 80px;
    font-size: 17px;
  }
}
</style>
