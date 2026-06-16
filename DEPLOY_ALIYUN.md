# 阿里云 (Alibaba Cloud) 部署指南

本项目采用全栈分离式架构，前端采用 React + Vite，后端采用 Node.js (Express) + Drizzle ORM，数据库为 PostgreSQL。在部署至阿里云时，我们推荐采用 **ECS（云服务器） + RDS（云数据库）** 的架构。

## 1. 基础环境架构

- **服务器**: 阿里云 ECS (架构: x86_64，操作系统推荐 Ubuntu 22.04 LTS)
- **数据库**: 阿里云 RDS for PostgreSQL (推荐 PostgreSQL 15 及以上版本)
- **Node 环境**: Node.js v20 或 v22
- **进程管理**: PM2

## 2. 第一步：准备数据库 (RDS)

1. 在阿里云控制台购买并创建 **RDS PostgreSQL** 实例。
2. 创建完毕后，进入 **白名单与安全组**，将 ECS 服务器的内网 IP 地址添加到白名单中。如果不使用专用网络内网连接，可申请外网地址。
3. 创建**账号**：在“账号管理”中新建数据库账号（如 `app_admin`），并设置强密码。
4. 创建**数据库**：在“数据库管理”新建数据库（如 `smart_care`），授权给上面创建的账号。

记下以下连接信息：
* Host (内网/外网访问地址)
* User
* Password
* Database Name

## 3. 第二步：准备服务器与环境 (ECS)

1. 购买阿里云 ECS，确保开放相应的安全组端口（如 Web 的 80/443 端口，和项目的启动端口 `3000`）。
2. SSH 远程连接至你的 ECS:

```bash
# 升级系统包
sudo apt update && sudo apt upgrade -y

# 安装 Node.js (以 Node 20 为例)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v

# 安装 PM2 (强大的 Node.js 进程守护和管理器)
sudo npm install -g pm2
```

## 4. 第三步：部署代码

1. **打包你的应用源码**。在此平台内，你可以通过侧边栏或下载按钮将应用导出为 ZIP 包。
2. 将压缩文件通过 `scp` 或者 `sftp` 上传至阿里云 ECS，并在服务器内进行解压（假设放在 `/var/www/smartcare`）。

```bash
cd /var/www/smartcare

# 安装所有依赖
npm install --production=false
# 注意：构建时需要依赖 Vite、esbuild 等开发依赖，请勿使用 --omit=dev
```

## 5. 第四步：配置环境变量

在项目的根目录创建 `.env` 环境配置文件，填入相关密钥和你在 RDS 处获得的 PostgreSQL 连接信息。

```bash
nano .env
```

填入以下内容：

```env
# 核心设置
NODE_ENV=production
PORT=3000

# 数据库连接 (替换为阿里云RDS的实际信息)
SQL_HOST=rm-xxxxxx.pg.rds.aliyuncs.com
SQL_DB_NAME=smart_care
SQL_ADMIN_USER=app_admin
SQL_ADMIN_PASSWORD=your_secure_password

# 鉴权和其它配置
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_key_if_used
```

## 6. 第五步：执行数据库迁移 & 启动构建

在正式启动项目之前，需要先将数据表结构同步到 RDS 中：

```bash
# 将 Drizzle 数据库定义推送到 RDS PostgreSQL 中
npx drizzle-kit push --config src/db/drizzle.config.ts

# 运行生产构建代码 (此步骤会将后端服务器编译至 dist/server.cjs 并产出前端静态文件)
npm run build
```

## 7. 第六步：启动和守护服务

使用 PM2 在后台驻留启动生产应用：

```bash
# 启动你的应用
pm2 start npm --name "smartcare" -- run start

# 查看日志确认启动无误
pm2 logs smartcare

# 设置开机自启动
pm2 startup
pm2 save
```

## 8. 扩展：使用 Nginx 配置反向代理与 HTTPS (推荐)

直接将应用的 HTTP `3000` 端口暴露到公网是不够安全的，通常我们需要配置 Nginx 代理它，并绑定域名及 HTTPS 证书。

1. **安装 Nginx**
```bash
sudo apt install nginx -y
```

2. **配置站点反向代理**：新建配置文件 `/etc/nginx/sites-available/smartcare`：

```nginx
server {
    listen 80;
    server_name your_domain.com; # 替换为你的真实域名

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

3. **激活配置**：
```bash
sudo ln -s /etc/nginx/sites-available/smartcare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

如果需要 HTTPS，可以使用阿里云申请免费 SSL 证书，或使用 `certbot` 自动签发 Let's Encrypt 证书：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

---

**部署完毕**！访问你的域名或阿里云服务器公网 IP 地址即可正常使用系统。如果在上线过程中遇到任何数据库或环境异常，均可通过 `pm2 logs` 和 `sudo tail -f /var/log/nginx/error.log` 定位排查。
