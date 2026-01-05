const DeployWithGitUrl = require("./DeployWithGitUrl");
require("dotenv").config();

module.exports = async function (webhook) {
        
    try {
        
        if (!webhook.ref || webhook.ref !== `refs/heads/${process.env.BRANCHES}`)
        {
            console.log(`Push ignoré, ce n'est pas la branche ${process.env.BRANCHES}`);
            return;
        }

        const repoUrl = webhook.repository.clone_url;
        if (!repoUrl) throw new Error("repoUrl non défini");

        DeployWithGitUrl(repoUrl, process.env.BRANCHES);

    } catch (err) {
        console.error("Erreur lors du déploiement :", err);
    }
    
};
