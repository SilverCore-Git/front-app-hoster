const execCommand = require("../utils/execCommand");
const fs = require("fs");
const path = require("path");

module.exports = async function (repoUrl, branche = "main") {
    
    try {
        
        if (!repoUrl) {
            throw new Error("repoUrl non défini");
        }

        const appDir = path.resolve(__dirname, "../../app");

        if (!fs.existsSync(appDir)) {
            console.log("📦 Clonage du repo dans ./app...");
            await execCommand(`git clone -b ${branche} ${repoUrl} ${appDir}`);
        } else {
            console.log("🔄 Mise à jour du repo existant...");
            await execCommand(`git -C ${appDir} fetch --all`);
            await execCommand(`git -C ${appDir} reset --hard origin/${branche}`);
        }

        console.log("📦 Installation des dépendances...");
        
        const hasPackageLock = fs.existsSync(path.join(appDir, "package-lock.json"));
        
        if (hasPackageLock) {
            await execCommand(`npm ci`, { 
                cwd: appDir,
                env: { ...process.env, NODE_ENV: 'development' }
            });
        } else {
            await execCommand(`npm install`, { 
                cwd: appDir,
                env: { ...process.env, NODE_ENV: 'development' }
            });
        }

        console.log("🔍 Vérification des outils de build...");
        try {
            await execCommand(`npx vue-tsc --version`, { cwd: appDir });
            console.log("✅ vue-tsc disponible");
        } catch (error) {
            console.warn("⚠️ vue-tsc non trouvé, installation...");
            await execCommand(`npm install -D vue-tsc typescript`, { cwd: appDir });
        }

        console.log("🔨 Build du projet...");
        await execCommand(`npm run build`, { 
            cwd: appDir,
            env: { ...process.env, NODE_ENV: 'production' }
        });

        console.log("✅ Déploiement terminé avec succès !");
        
        return { success: true, appDir };

    } catch (err) {

        console.error("❌ Erreur lors du déploiement :", err.message);
        
        if (err.stdout) console.error("stdout:", err.stdout);
        if (err.stderr) console.error("stderr:", err.stderr);
        
        throw err;
    }

};