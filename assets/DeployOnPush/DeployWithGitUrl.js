const execCommand = require("../utils/execCommand");
const fs = require("fs");
const path = require("path");
require("dotenv").config();



module.exports = async function () {
        
    try {

        const repoUrl = process.env.GIT_URL;
        if (!repoUrl) throw new Error("process.env.GIT_URL non défini");

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

        return
        console.log("Installation des dépendances...");
        await execCommand(`npm install`, { cwd: appDir });

        
        console.log("Build du projet...");
        await execCommand(`npm run build`, { cwd: appDir });

        console.log("✅ Déploiement terminé !");

    } catch (err) {
        console.error("Erreur lors du déploiement :", err);
    }

};

