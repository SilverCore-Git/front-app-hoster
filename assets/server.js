console.log("Démarrage du serveur...");

const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const webhook_router = require("./routes/webhook");
const { isUpdating  } = require("./var/onUpdate");
const { isMaintenance  } = require("./var/maintenance");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use((err, req, res, next) => {
    console.error("🔥 Erreur:", err);

    if (req.path.startsWith("/api")) {
        return res.status(500).json({
            error: true,
            morgan: "Erreur interne du serveur",
        });
    }

    res.status(500).sendFile(
        path.join(__dirname, "views", "500.html")
    );
});


app.use(`/api/webhook`, webhook_router);
app.use('/api/views', express.static(path.join(__dirname, 'views')));

app.get('/api/maj/status', (req, res) => {
    res.json({ isUpdating: isUpdating() });
})

app.use((req, res, next) => {
    if (isMaintenance()) {
        if (req.path.startsWith('/api/views')) {
            return next();
        }
        return res.sendFile(path.join(__dirname, "views", "maintenance.html"));
    }
    next();
});

app.use((req, res, next) => {
    if (isUpdating()) {
        if (req.path.startsWith('/api/views')) {
            return next();
        }
        return res.sendFile(path.join(__dirname, "views", "onUpdate.html"));
    }
    next();
});


app.use(express.static(path.join(__dirname, "../app/dist")));


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../app/dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

http.createServer(app).listen(PORT, () => {
    console.log(`✅ Serveur en ligne sur le port ${PORT}`);
});