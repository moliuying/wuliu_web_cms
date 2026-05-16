# PM2 启动物流 CMS 服务器

## 快速开始

### 1. 启动应用（开发环境）
```bash
pm2 start ecosystem.config.js
```

### 2. 启动应用（生产环境）
```bash
pm2 start ecosystem.config.js --env production
```

## 常用命令

### 查看应用状态
```bash
pm2 list
# 或
pm2 status
```

### 查看应用详细信息
```bash
pm2 show wuliu-cms-server
```

### 查看日志
```bash
# 查看所有日志
pm2 logs

# 查看指定应用日志
pm2 logs wuliu-cms-server

# 清空日志
pm2 flush
```

### 重启应用
```bash
pm2 restart wuliu-cms-server
```

### 停止应用
```bash
pm2 stop wuliu-cms-server
```

### 删除应用
```bash
pm2 delete wuliu-cms-server
```

### 重新加载（0秒停机）
```bash
pm2 reload wuliu-cms-server
```

### 监控
```bash
# 实时监控
pm2 monit

# Web 监控界面
pm2 web
```

## 开机自启动

### 生成启动脚本
```bash
pm2 startup
```

### 保存当前应用列表
```bash
pm2 save
```

### 取消自启动
```bash
pm2 unstartup
```

## 其他实用命令

### 停止所有应用
```bash
pm2 stop all
```

### 重启所有应用
```bash
pm2 restart all
```

### 删除所有应用
```bash
pm2 delete all
```

### 更新 PM2
```bash
npm install pm2@latest -g
pm2 update
```

## 配置说明

配置文件：`ecosystem.config.js`

- **name**: 应用名称
- **script**: 启动脚本路径
- **instances**: 实例数量（1=单实例，'max'=所有CPU核心）
- **exec_mode**: 执行模式（fork/cluster）
- **watch**: 是否监听文件变化自动重启
- **env**: 环境变量配置

## 日志位置

- 错误日志：`./logs/err.log`
- 输出日志：`./logs/out.log`

## 故障排查

如果遇到端口占用问题：
```bash
# 查看端口占用
lsof -i :3333

# 杀死占用端口的进程
kill -9 <PID>
```
