/**
 * WASM 预加载工具
 * 利用浏览器 HTTP 缓存机制，提前加载 MediaPipe 所需的 WASM 和模型文件
 * 
 * 原理：
 * 1. 页面加载时 fetch WASM 文件 → 浏览器缓存
 * 2. MediaPipe 初始化时 fetch 同一个 URL → 浏览器返回缓存（不发起网络请求）
 * 3. 二次访问时直接使用缓存（30 分钟内有效）
 */

export class WASMPreloader {
  constructor() {
    // WASM 文件路径（相对于 web-app 的 public 目录）
    // 文件已复制到 web-app/public/model/ 目录
    // 注意：Vite 的 base 配置是 /web-app/，所以路径要加上这个前缀
    this.wasmFiles = [
      '/web-app/model/wasm/vision_wasm_internal.js',
      '/web-app/model/wasm/vision_wasm_internal.wasm',
      '/web-app/model/face_landmarker.task'
    ];
    
    this.loaded = false;
    this.loading = false;
    this.loadTime = null;
  }

  /**
   * 预加载所有 WASM 文件
   * @returns {Promise<boolean>} - 是否成功
   */
  async preload() {
    // 如果已经加载过，直接返回
    if (this.loaded && this.isCacheValid()) {
      return true;
    }
    
    // 如果正在加载，等待完成
    if (this.loading) {
      return true;
    }
    
    this.loading = true;
        
    try {
      // 并行加载所有文件
      const promises = this.wasmFiles.map(async (url) => {
        try {
          // 使用 force-cache 策略，优先使用缓存
          const response = await fetch(url, { cache: 'force-cache' });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${url}`);
          }
          
          // 读取文件内容（触发浏览器缓存）
          await response.arrayBuffer();
          
          return true;
          
        } catch (error) {
          return false;
        }
      });
      
      const results = await Promise.all(promises);
      const successCount = results.filter(r => r === true).length;
      
      
      // 标记为已加载
      if (successCount > 0) {
        this.loaded = true;
        this.loadTime = Date.now();
        
        // 记录到 sessionStorage（用于检查）
        sessionStorage.setItem('wasm_preloaded', 'true');
        sessionStorage.setItem('wasm_preload_time', Date.now().toString());
      }
      
      this.loading = false;
      return successCount === this.wasmFiles.length;
      
    } catch (error) {
      this.loading = false;
      return false;
    }
  }

  /**
   * 检查缓存是否有效（30 分钟内）
   */
  isCacheValid() {
    if (!this.loadTime) return false;
    
    const now = Date.now();
    const age = now - this.loadTime;
    const maxAge = 30 * 60 * 1000; // 30 分钟
    
    return age < maxAge;
  }

  /**
   * 检查是否已预加载
   */
  isPreloaded() {
    const preloaded = sessionStorage.getItem('wasm_preloaded');
    const preloadTime = sessionStorage.getItem('wasm_preload_time');
    
    if (!preloaded || !preloadTime) {
      return false;
    }
    
    return this.isCacheValid();
  }

  /**
   * 获取预加载状态
   */
  getStatus() {
    return {
      loaded: this.loaded,
      loading: this.loading,
      preloaded: this.isPreloaded(),
      loadTime: this.loadTime,
      cacheValid: this.isCacheValid()
    };
  }

  /**
   * 清除预加载状态
   */
  clear() {
    this.loaded = false;
    this.loading = false;
    this.loadTime = null;
    sessionStorage.removeItem('wasm_preloaded');
    sessionStorage.removeItem('wasm_preload_time');
  }
}

// 单例导出
export const wasmPreloader = new WASMPreloader();

// 默认导出
export default wasmPreloader;
