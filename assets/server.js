console.log("Démarrage du serveur...");

const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const webhook_router = require("./routes/webhook");
const api_router = require("./routes/api");
const { isUpdating  } = require("./var/onUpdate");
const { isMaintenance } = require("./var/maintenance");
const { isErrored, setErrored } = require("./var/errored");
const { version } = require("../package.json");
require("dotenv").config();


const app = express();

app.use(morgan("dev"));
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', `Silverhost/${version}`);
  next();
});

app.use(`/score-host/api`, api_router);
app.use(`/score-host/api/webhook`, webhook_router);
app.use('/score-host/api/views', express.static(path.join(__dirname, 'views')));


app.use((req, res, next) => {
    if (isMaintenance()) {
        if (req.path.startsWith('/score-host/api/views')) {
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
    setErrored(false);
    res.sendFile(path.join(__dirname, "../app/dist", "index.html"));
});

app.use((err, req, res, next) => {
    console.error("🔥 Erreur:", err);
    setErrored(true);

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


const PORT = process.env.PORT || 3000;

http.createServer(app).listen(PORT, () => {
    console.log(`✅ Serveur en ligne sur le port ${PORT}`);
});