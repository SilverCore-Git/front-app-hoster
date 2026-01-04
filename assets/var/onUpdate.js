const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "state.json");

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ isUpdating: false }));
}

module.exports = {
    setUpdating(val) {
        try {
            const data = { isUpdating: !!val };
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error("Erreur lors de l'écriture du statut de mise à jour :", err);
        }
    },

    isUpdating() {
        try {
            const data = fs.readFileSync(filePath, "utf8");
            const parsed = JSON.parse(data);
            return parsed.isUpdating;
        } catch (err) {
            console.error("Erreur lors de la lecture du statut de mise à jour :", err);
            return false;
        }
    }
};