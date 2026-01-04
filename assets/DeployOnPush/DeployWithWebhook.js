const DeployWithGitUrl = require("./DeployWithGitUrl");

module.exports = async function (webhook) {
        
    try {
        
        if (!webhook.ref || webhook.ref !== "refs/heads/main")
        {
            console.log("Push ignoré, ce n'est pas la branche main");
            return;
        }

        const repoUrl = webhook.repository.clone_url;
        if (!repoUrl) throw new Error("repoUrl non défini");

        DeployWithGitUrl(repoUrl);

    } catch (err) {
        console.error("Erreur lors du déploiement :", err);
    }
    
};
