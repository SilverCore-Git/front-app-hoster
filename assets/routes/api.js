const express = require("express");
const router = express.Router();
const { isMaintenance, setMaintenance } = require("../var/maintenance");
const { isUpdating } = require("../var/onUpdate");
const { isErrored } = require("../var/errored");
const config = require("../../ecosystem.config.cjs");

// Get service status
router.get("/status", (req, res) => {
    const env = config.apps[0].env;
    const pkg = require("../../package.json");
    const appPkg = require("../../app/package.json");

    try {
        res.json({
            "score-host": {
                ok: true,
                version: pkg.version || "unknown"
            },
            service: {
                ok: true,
                name: config.apps[0].name,
                maintenance: isMaintenance(),
                errored: isErrored(),
                onUpdate: isUpdating(),
                version: appPkg.version || "unknown"
            }
        });
    } catch (err) {
        console.error("Erreur lors de la lecture du statut :", err);
        res.status(500).json({
            error: true,
            message: "Erreur lors de la lecture du statut"
        });
    }
});

// Set maintenance mode with password
router.get("/manager/:mdp/set-maintenance/:value", (req, res) => {
    const { mdp, value } = req.params;

    // Verify password
    if (mdp !== config.apps[0].env.API_PWD) {
        return res.status(401).json({
            error: true,
            message: "Mauvais mot de passe"
        });
    }

    // Verify value
    if (value !== "true" && value !== "false") {
        return res.status(400).json({
            error: true,
            message: "La valeur doit être 'true' ou 'false'"
        });
    }

    try {
        const maintenanceMode = value === "true";
        setMaintenance(maintenanceMode);

        res.json({
            success: true,
            message: maintenanceMode ? "Mode maintenance activé" : "Mode maintenance désactivé",
            maintenance: maintenanceMode
        });
    } catch (err) {
        console.error("Erreur lors du changement de maintenance :", err);
        res.status(500).json({
            error: true,
            message: "Erreur lors du changement de maintenance"
        });
    }
});

module.exports = router;
