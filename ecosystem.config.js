module.exports = {
  apps : [
    {
        "name": "kyonggi-time-table",
        "script": "./dist/main.js",
        "instances": 0,
        "exec_mode": "cluster",
        "wait_ready": true,
        "listen_timeout": 50000,
        "kill_timeout": 5000,
        "max_memory_restart": "300M"
    }
  ]
};
