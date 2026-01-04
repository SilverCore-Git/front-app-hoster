const DeployWithGitUrl = require("./DeployOnPush/DeployWithGitUrl");

return new Promise((resolve, reject) => {
    DeployWithGitUrl()
        .then(resolve)
        .catch(reject);
});