module.exports = {
    apps: [
        {
            name: "www.service.fr", // domaine
            script: "server.js",
            instances: 1,            // ou "max" si cluster
            exec_mode: "fork",       // ou "cluster"
            autorestart: true,
            watch: false,
            max_memory_restart: "300M",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            },
        },
    ],
};
