const config = require('../ecosystem.config.cjs');
const env = config.apps[0].env;

console.log([
    `GITHUB_WORKFLOW : https://${config.apps[0].name}/score-host/api/webhook/${env.WEBHOOK_ID}`,
    `GITHUB_SECRET : ${env.WEBHOOK_SECRET}`,
    `IP : localhost:${env.PORT}`,
    `API_PWD : ${env.API_PWD}`
])