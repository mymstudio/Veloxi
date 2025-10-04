<p align="center">
  <img src="https://youke1.picui.cn/s1/2025/10/02/68ddd1f761602.png" width="128" />
</p>

<h1 align="center">Veloxi</h1>


 <img src="https://img.shields.io/badge/Powered_By-Boxy-blue?labelColor=%23d1e0fd&color=%234062F6&link=https%3A%2F%2Fgitee.com%2Fcocotais%2Fboxy"/>   

<p align="center">一个开源，免费的小米 Vela 快应用图形化编辑器<br>
基于 Boxy 开发
</p>

## 安装

1. **环境检查： 确保你的电脑已经安装了最新版本的 Node.js。**
   Veloxi 是纯客户端 Web 应用，
   仅使用 Node.js 进行自动化处理。

2. **克隆仓库：将本仓库克隆到本地。** 

   ```shell
   git clone https://github.com/mymstudio/Veloxi.git
   ```

3. **环境配置：配置本地开发环境。**

   ```shell
   cd veloxi
   ```

   ```shell
   yarn install
   ```

### 开发模式

- 监听源码变化，编译并执行热重载。

  ```shell
  yarn dev
  ```

### 生产模式

1. 构建并优化生成。

   ```shell
   yarn build
   ```

2. 预览构建。

   ```shell
   yarn preview
   ```

### 格式化

- 请在 `commit` 前执行格式化程序。

  ```shell
  yarn format
  ```

  ```shell
  yarn style
  ```

  ```shell
  yarn lint
  ```
