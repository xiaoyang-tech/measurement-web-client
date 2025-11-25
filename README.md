# 小阳心健康测量Web SDK示例客户端

- [SDK 用户手册](https://measurement.xymind.cn/docs/sdk/web.html)

## 运行
-  **运行之前需要先在`.env.prod`中填入合法的 [TOKEN](https://measurement.xymind.cn/docs/api/authorization.html) (使用许可证获取)。**
- node version >= v22.12.0

    ```bash
    # 安装依赖
    yarn install

    # 运行示例程序
    yarn dev
    ```
> 跨域问题

直接在本地运行当前示例程序存在服务请求跨域问题。

- 本地开发时可以使用代理方式避免跨域问题。比如简单运行 nginx 代理转发网络请求，步骤入下：
    1. 配置 nginx 服务转发规则，可以参考`nginx.conf`文件。
    2. 启动 nginx 服务，推荐使用Docker容器：
        
        `docker run -it --rm -p 10000:80 -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf" nginx:alpine`
    
    3. 修改`.env.prod`中的`VITE_MEASUREMENT_URL`指向nginx监听地址，如：http://localhost:10000

- 生产环境中不便配置代理转发时，可以联系我们开放跨域域名。