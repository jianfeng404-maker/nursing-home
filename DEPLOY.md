# 智能颐养平台 - 部署说明文档

本项目为前后端一体化的现代 Web 应用程序（React + Vite + Express + Drizzle ORM + PostgreSQL），采用全栈式部署模式。本指南将指导您在生产环境中完成部署。

## 1. 环境要求

在部署之前，请确保您的服务器满足以下基本环境要求：
* **Node.js**: v18.0.0 或更高版本
* **包管理器**: npm 或 yarn
* **数据库**: PostgreSQL 14 或更高版本（支持本地安装或如云数据库等托管服务）

## 2. 代码获取与依赖安装

1. 获取完整的代码库并上传至服务器目录。
2. 进入项目根目录并安装依赖模块：

```bash
# 如果使用 npm
npm install

# 如果使用 yarn
yarn install
```

## 3. 配置环境变量

在项目根目录下创建一个 `.env` 文件，并根据您的实际环境修改以下配置：

```env
# 端口设置，推荐生产环境保留或由反向代理（如 Nginx）转发
PORT=3000

# PostgreSQL 数据库连接信息（请替换为您真实的数据库连接信息）
SQL_HOST=localhost
SQL_DB_NAME=your_database_name
SQL_ADMIN_USER=your_user
SQL_ADMIN_PASSWORD=your_password

# JWT 密钥（必须修改为一个强大的随机字符串，用于安全签发登录凭证）
JWT_SECRET=your_super_secret_rand_key_here
```

## 4. 数据库初始化

项目使用 Drizzle ORM 管理数据库的 Schema。在启动应用之前，必须先将表结构同步到数据库中：

```bash
# 执行数据库结构同步及迁移
npx drizzle-kit push
```

*注意：确保您的 PostgreSQL 数据库已经创建并可正常访问，且上述 `.env` 中的 `SQL_HOST` 等配置正确。*

## 5. 项目构建

执行构建命令。该命令将会把前端 React 应用打包到 `dist` 目录，同时把后端 `server.ts` 编译为 `dist/server.cjs` 以便 Node.js 生产环境直接运行：

```bash
npm run build
```

## 6. 启动应用

### 方式一：直接运行（适合简单测试）

```bash
npm run start
```
应用将会运行在 `.env` 中配置的端口（如 `http://localhost:3000`）。

### 方式二：使用 PM2 守护进程（推荐生产环境使用）

为了保证服务在后台稳定运行并能够开机自启，推荐使用 PM2：

```bash
# 全局安装 PM2
npm install pm2 -g

# 启动服务
pm2 start npm --name "smart-care" -- run start

# 保存 PM2 进程列表（用于开机自启）
pm2 save
pm2 startup
```

## 7. 初始账号配置

平台首次运行时，内置了管理员引导创建流程。
部署成功并成功访问网页后，请使用以下逻辑进行初次登录：
- 账号：`admin`
- 密码：输入您想设置的**任意新密码**
- 动作：点击登录即可。系统会自动判断，如果数据库中暂无账号信息，会以此密码为您初始化 `admin` 系统管理员账号并自动登录进入系统。其他用户的账号后续可在系统内部进行管理和分配。

---

## 附加：Nginx 反向代理配置参考

如果您需要配置域名、并挂载 SSL 证书，可以使用 Nginx 进行反向代理转发：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
