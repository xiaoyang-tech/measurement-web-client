let animationID = null
export default {
  methods: {
    draw(
      byID = 'canvas-mask',
      mask = false,
      message = '保持人脸在圆框区域',
      loadProgress = false,
    ) {
      const canvas = document.getElementById(byID);
      const ctx = canvas.getContext('2d');
      const lineWidth = 16;
      const width = canvas.width; // 矩形的宽度
      const height = canvas.height; // 矩形的高度
      ctx.clearRect(0, 0, width, height);
      this.drawBackground(ctx, '#C82E36', width, height) // 画整个背景
      this.drawTransparentCircles(ctx, width, height) // 画环形
      cancelAnimationFrame(animationID)
      if (mask) {
        this.drawTextInformation(ctx, width, height, message) // 画文本信息
      }
      if (!loadProgress) {
        this.drawCircleBackground(ctx, width, height, lineWidth)
      } else {
        this.drawProgress(ctx, width, height, lineWidth)
      }
    },
    drawRepaint(ctx, width, height) {
      this.drawBackground(ctx, '#C82E36', width, height) // 画整个背景
      this.drawTransparentCircles(ctx, width, height) // 画环形
    },
    drawBackground(ctx, color, width, height) {
      ctx.fillStyle = color; // 矩形的填充颜色
      ctx.fillRect(0, 0, width, height);
    },
    drawCircleBackground(ctx, width, height, lineWidth) {
      let centerX = width / 2
      let centerY = height / 2
      let radius = height / 100 * 80 / 2
      ctx.globalCompositeOperation = "source-over"; // 设置组合模式为目标减去源
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#f9f5f5"; // Background color
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    },
    drawTransparentCircles(ctx, width, height) {
      let centerX = width / 2
      let centerY = height / 2
      let radius = height / 100 * 80 / 2
      ctx.globalCompositeOperation = "destination-out"; // 设置组合模式为目标减去源
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
    },
    drawProgress(ctx, width, height, lineWidth) {
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      let centerX = width / 2
      let centerY = height / 2
      let radius = height / 100 * 80 / 2

      let startTimestamp;
      const vm = this;
      function animate(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        let progress = (timestamp - startTimestamp) / 27000;
        progress = Math.min(progress, 1); // Ensure progress doesn't exceed 1
        // 绘制到离屏画布
        offscreenCtx.clearRect(0, 0, width, height); // 清除整个离屏画布

        vm.drawBackground(offscreenCtx, '#C82E36', width, height) // 画整个背景

        vm.drawTransparentCircles(offscreenCtx, width, height)

        vm.drawCircleBackground(offscreenCtx, width, height, lineWidth)
        // Draw progress circle
        offscreenCtx.beginPath();
        offscreenCtx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        offscreenCtx.strokeStyle = "#07c160"; // Progress color
        offscreenCtx.lineWidth = lineWidth;
        offscreenCtx.stroke();

        // Draw center point
        let pointX = centerX + Math.cos(-Math.PI / 2 + Math.PI * 2 * progress) * radius;
        let pointY = centerY + Math.sin(-Math.PI / 2 + Math.PI * 2 * progress) * radius;
        offscreenCtx.beginPath();
        offscreenCtx.arc(pointX, pointY, lineWidth / 2, 0, Math.PI * 2);
        offscreenCtx.fillStyle = progress === 0 ? '#f9f5f5' : "#117e04"; // Point color
        offscreenCtx.fill();

        // 将离屏画布的内容绘制到主画布上
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over"; // 设置组合模式为目标减去源
        ctx.drawImage(offscreenCanvas, 0, 0, width, height);
        if (progress < 1) {
          animationID = requestAnimationFrame(animate); // Continue animation until progress reaches 1
        }
      }
      animationID = requestAnimationFrame(animate); // Start animation
    },
    drawTextInformation(ctx, width, height, msg) {
      let centerX = width / 2
      let centerY = height / 2
      let radius = height / 100 * 80 / 2
      ctx.globalCompositeOperation = "source-over"; // 设置组合模式为目标减去源
      ctx.beginPath();
      radius = height / 100 * 80 / 2
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
      ctx.fill();
      // 在中心绘制文本
      ctx.fillStyle = "#fff"; // 文本的颜色
      ctx.font = "32px Arial"; // 文本的字体和大小
      const textWidth = ctx.measureText(msg).width; // 计算文本宽度
      const textX = centerX - textWidth / 2; // 文本的 x 坐标
      const textY = centerY + 10; // 文本的 y 坐标（假设文本高度为20px）
      ctx.fillText(msg, textX, textY);
    }
  }
}
