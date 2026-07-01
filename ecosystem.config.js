module.exports = {
  apps: [
    {
      name: "wholesale-hub",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3021 -H 0.0.0.0",
      instances: "1",
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
