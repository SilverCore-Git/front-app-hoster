console.log("Démarrage du serveur...");

const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const webhook_router = require("./routes/webhook");
const { isUpdating  } = require("./var/onUpdate");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));

app.use(`/api/webhook`, webhook_router);
app.use('/api/views', express.static(path.join(__dirname, 'views')));

app.get('/api/maj/status', (req, res) => {
    res.json({ isUpdating: isUpdating() });
})

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