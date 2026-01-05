const execCommand = require("../utils/execCommand");
const fs = require("fs");
const path = require("path");
const { setUpdating } = require("../var/onUpdate");
const pc = require("picocolors");
const cliProgress = require("cli-progress");

module.exports = async function
(repoUrl, branche = "main")
{

    setUpdating(true);

    const progressBar = new cliProgress.SingleBar({
        format: pc.cyan('{bar}') + ' | ' + pc.bold('{percentage}%'),
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });


    const logStatus = (emoji, message) => {
        process.stdout.write(`\r\x1b[K${emoji} ${pc.white(message)}\n`);
    };

    console.log(pc.bold(pc.magenta("\n--- 🛠️ SYSTÈME DE DÉPLOIEMENT ---")));
    progressBar.start(100, 0);

    try {

        if (!repoUrl) throw new Error("repoUrl non défini");
        const appDir = path.resolve(__dirname, "../../app");

        // --- ÉTAPE 1 ---
        logStatus("🛰️", "Connexion au dépôt distant...");
        progressBar.update(10);
        if (!fs.existsSync(appDir)) {
            logStatus("📥", `Clonage de [${branche}]...`);
            await execCommand(`git clone -b ${branche} ${repoUrl} ${appDir}`);
        } else {
            logStatus("🔄", "Mise à jour du code source (Git Pull)...");
            await execCommand(`git -C ${appDir} fetch --all`);
            await execCommand(`git -C ${appDir} reset --hard origin/${branche}`);
        }

        // --- ÉTAPE 2 ---
        progressBar.update(30);
        logStatus("🔑", "Synchronisation des variables d'environnement (.env)...");
        const envPath = path.join(__dirname, '../../', '.env');
        if (fs.existsSync(envPath)) {
            fs.copyFileSync(envPath, path.join(appDir, '.env'));
        }

        // --- ÉTAPE 3 ---
        progressBar.update(50);
        logStatus("📦", "Installation des modules node_modules (cela peut prendre un moment)...");
        const hasPackageLock = fs.existsSync(path.join(appDir, "package-lock.json"));
        await execCommand(hasPackageLock ? "npm ci --force" : "npm install --force", { 
            cwd: appDir, 
            env: { ...process.env, NODE_ENV: 'development' } 
        });

        // --- ÉTAPE 4 ---
        progressBar.update(70);
        logStatus("🔍", "Vérification de l'intégrité du compilateur...");
        try {
            await execCommand(`npx vue-tsc --version`, { cwd: appDir });
        } catch {
            logStatus("🔨", "Installation des outils de build manquants...");
            await execCommand(`npm install -D vue-tsc typescript`, { cwd: appDir });
        }

        // --- ÉTAPE 5 ---
        progressBar.update(85);
        logStatus("⚡", "Compilation du projet (Build Production)...");
        await execCommand(`npm run build`, { 
            cwd: appDir, 
            env: { ...process.env, NODE_ENV: 'production' } 
        });

        // --- FIN ---
        progressBar.update(100);
        progressBar.stop();
        console.log(`\n${pc.green("✔")} ${pc.bold("Déploiement terminé avec succès !")}\n`);
        
        return { success: true, appDir };

    } catch (err) {
        progressBar.stop();
        console.log(`\n\n${pc.bgRed(pc.white(" ❌ ERREUR "))} ${pc.red(err.message)}`);
        throw err;
    } finally {
        setUpdating(false);
    }
    
};