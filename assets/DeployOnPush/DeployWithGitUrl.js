const execCommand = require("../utils/execCommand");
const fs = require("fs");
const path = require("path");
const { setUpdating } = require("../var/onUpdate");


module.exports = async function (repoUrl, branche = "main") {

    setUpdating(true);
    
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

        console.log('🔍 Recherche de .env...');

        if (fs.existsSync(path.join(__dirname, '../../', '.env')))
        {
            console.log('✅ .env trouvé, mise à jour...');
            fs.copyFileSync(path.join(__dirname, '../../', '.env'), path.join(appDir, '.env'));
        }
        else
        {
            console.log('❌ .env non trouvé.');
        }

        console.log("📦 Installation des dépendances...");
        
        const hasPackageLock = fs.existsSync(path.join(appDir, "package-lock.json"));
        
        if (hasPackageLock) {
            await execCommand(`npm ci --force`, { 
                cwd: appDir,
                env: { ...process.env, NODE_ENV: 'development' }
            });
        } else {
            await execCommand(`npm install --force`, { 
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
    finally {
        setUpdating(false);
    }

};