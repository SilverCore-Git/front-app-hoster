module.exports = {
    apps: [
        {
            name: "www.silvercore.fr", // domaine
            script: "assets/server.js",
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
                NODE_ENV: "production",
                PORT: 3000,
            },
        },
    ],
};
