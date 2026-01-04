const execCommand = require("../utils/execCommand");
const fs = require("fs");
const path = require("path");

module.exports = async function (webhook) {
        
    try {
        
        if (!webhook.ref || webhook.ref !== "refs/heads/main")
        {
            console.log("Push ignoré, ce n'est pas la branche main");
            return;
        }

        const repoUrl = webhook.repository.clone_url;
        const appDir = path.resolve(__dirname, "../../app");

        if (!fs.existsSync(appDir))
        {
            console.log("Clonage du repo dans ./app...");
            await execCommand(`git clone ${repoUrl} ${appDir}`);
        }
        else
        {
            console.log("Mise à jour du repo existant...");
            await execCommand(`git -C ${appDir} fetch --all`);
            await execCommand(`git -C ${appDir} reset --hard origin/main`);
        }

        console.log("Installation des dépendances...");
        await execCommand(`npm install`, { cwd: appDir });

        console.log("Build du projet...");
        await execCommand(`npm run build`, { cwd: appDir });

        console.log("✅ Déploiement terminé !");

    } catch (err) {
        console.error("Erreur lors du déploiement :", err);
    }
    
};
