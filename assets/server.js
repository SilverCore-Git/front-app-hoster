console.log("Démarrage du serveur...");

const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const webhook_router = require("./routes/webhook");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));

app.use(`/api/webhook`, webhook_router);
app.use(express.static(path.join(__dirname, "../app/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../app/dist", "index.html"));
});

const PORT = process.env.PORT;

if (!PORT) {
    throw new Error("PORT non défini (process.env.PORT)");
}

http.createServer(app).listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}`);
});