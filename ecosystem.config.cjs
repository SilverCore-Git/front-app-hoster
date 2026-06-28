module.exports = {
    apps: [
        {
            name: "www.service.fr", // domaine
            script: "assets/server.js",
            interpreter: "bun",
            instances: 1,            // ou "max" si cluster
            exec_mode: "fork",       // ou "cluster"
            autorestart: true,
            watch: false,
            max_memory_restart: "300M",
            env: {
                GIT_URL: "https://github.com/SilverCore-Git/repo.git",
                BRANCHES: "main",
                WEBHOOK_ID: "123456789",
                WEBHOOK_SECRET: "secret",
                API_PWD: "passwd",
                NODE_ENV: "production",
                PORT: 3000,
            },
        },
    ],
};
