const DeployWithGitUrl = require("./DeployOnPush/DeployWithGitUrl");
const config = require('../ecosystem.config.cjs');

return new Promise((resolve, reject) => {
    DeployWithGitUrl(config.apps[0].env.GIT_URL, config.apps[0].env.BRANCHES)
        .then(resolve)
        .catch(reject);
});