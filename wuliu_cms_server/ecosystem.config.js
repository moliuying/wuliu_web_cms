module.exports = {
  apps: [
    {
      name: 'wuliu-cms-server',        // 应用名称
      script: './bin/www',              // 启动脚本
      cwd: '/project/wuliu/wuliu_cms_server', // 工作目录
      instances: 1,                     // 启动实例数量，1 表示单实例，'max' 表示使用所有CPU核心
      exec_mode: 'cluster',               // 执行模式：fork 或 cluster
      watch: false,                     // 是否监听文件变化自动重启（生产环境建议 false）
      max_memory_restart: '500M',      // 内存超过限制自动重启
      env: {
        NODE_ENV: 'development',       // 开发环境变量
        PORT: 3333
      },
      env_production: {
        NODE_ENV: 'production',        // 生产环境变量
        PORT: 3333
      },
      error_file: './logs/err.log',    // 错误日志文件
      out_file: './logs/out.log',      // 输出日志文件
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // 日志日期格式
      merge_logs: true,                 // 合并日志
      autorestart: true,                // 自动重启
      min_uptime: '10s',               // 应用运行少于这个时间被认为是异常启动
      max_restarts: 10,                // 最大异常重启次数
      restart_delay: 4000,             // 重启延迟时间
    }
  ]
};
