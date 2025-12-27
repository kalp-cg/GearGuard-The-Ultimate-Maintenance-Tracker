module.exports = {
    apps: [{
        name: "gearguard-backend",
        script: "./dist/server.js",
        instances: "max",
        exec_mode: "cluster", // Enable load balancing
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}
