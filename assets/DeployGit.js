const DeployWithGitUrl = require("./DeployOnPush/DeployWithGitUrl");
require("dotenv").config();

return new Promise((resolve, reject) => {
    DeployWithGitUrl(process.env.GIT_URL)
        .then(resolve)
        .catch(reject);
});