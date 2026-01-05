const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "errored.json");

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ errored: false }));
}

module.exports = {
    setErrored(val) {
        try {
            const data = { errored: !!val };
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error("Erreur lors de l'écriture du statut d'erreur :", err);
        }
    },

    isErrored() {
        try {
            const data = fs.readFileSync(filePath, "utf8");
            const parsed = JSON.parse(data);
            return parsed.errored;
        } catch (err) {
            console.error("Erreur lors de la lecture du statut d'erreur :", err);
            return false;
        }
    }
};
