const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "maintenance.json");

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ isUpdating: false }));
}

module.exports = {
    setMaintenance(val) {
        try {
            const data = { isUpdating: !!val };
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error("Erreur lors de l'écriture du statut de maintenance :", err);
        }
    },

    isMaintenance() {
        try {
            const data = fs.readFileSync(filePath, "utf8");
            const parsed = JSON.parse(data);
            return parsed.isUpdating;
        } catch (err) {
            console.error("Erreur lors de la lecture du statut de maintenance :", err);
            return false;
        }
    }
};