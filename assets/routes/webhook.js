const { Router } = require("express");
const crypto = require("crypto");
const CreateNewBuild = require("../DeployOnPush/DeployWithWebhook");
require("dotenv").config();

const router = Router();

router.post(`/${process.env.WEBHOOK_ID}`, (req, res) => {
    
    const incomingSecret = req.headers['x-webhook-secret'];

    if (!incomingSecret) {
        return res.status(401).send("Header x-webhook-secret manquant");
    }

    const secretBuffer = Buffer.from(process.env.WEBHOOK_SECRET);
    const incomingBuffer = Buffer.from(incomingSecret);

    if (
        secretBuffer.length !== incomingBuffer.length ||
        !crypto.timingSafeEqual(secretBuffer, incomingBuffer)
    ) {
        return res.status(401).send("Secret invalide");
    }

    console.log("Nouveau Webhook validé");

    if (req.body.ref === 'refs/heads/main')
    {
        console.log('Nouveau push détecté sur main !');
        CreateNewBuild(req.body);
    }
    else
    {
        console.log('Nouveau push détecté sur autre branche !');
    }

    res.status(200).send("Webhook reçu et validé !");

});


module.exports = router;
