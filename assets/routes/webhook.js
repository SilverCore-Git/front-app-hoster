const { Router } = require("express");
const crypto = require("crypto");
const CreateNewBuild = require("../DeployOnPush/DeployWithWebhook");
require("dotenv").config();

const router = Router();


router.use(
  `/${process.env.WEBHOOK_ID}`,
  require('express').json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString('utf8');
    }
  })
);

router.post(`/${process.env.WEBHOOK_ID}`, (req, res) => {
    
    const signature = req.headers['x-hub-signature-256'];
    const event = req.headers['x-github-event'];
    const delivery = req.headers['x-github-delivery'];


    if (!signature) {
        console.error('❌ No signature header');
        return res.status(401).send("X-Hub-Signature-256 header manquant");
    }

    
    if (!process.env.WEBHOOK_SECRET) {
        console.error('❌ WEBHOOK_SECRET not configured');
        return res.status(500).send("Secret webhook non configuré");
    }

    
    const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

    
    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);

    if (
        signatureBuffer.length !== digestBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, digestBuffer)
    ) {
        console.error('❌ Invalid signature');
        console.error('Expected:', digest);
        console.error('Received:', signature);
        return res.status(401).send("Signature invalide");
    }

    console.log(`✅ Webhook validé - Event: ${event} - Delivery: ${delivery}`);

    
    if (event === 'push') {
        if (req.body.ref === `refs/heads/${process.env.BRANCHES}`) {
            console.log(`🚀 Nouveau push détecté sur ${process.env.BRANCHES} !`);
            console.log(`Commit: ${req.body.head_commit?.message}`);
            console.log(`Auteur: ${req.body.pusher?.name}`);
            
            try {
                CreateNewBuild(req.body);
            } catch (error) {
                console.error('❌ Erreur lors du build:', error);
                return res.status(500).send("Erreur lors du déploiement");
            }
        } else {
            console.log(`ℹ️ Push sur ${req.body.ref} - Ignoré`);
        }
    } else {
        console.log(`ℹ️ Événement ${event} reçu - Ignoré`);
    }

    res.status(200).send("Webhook reçu et validé !");

});

module.exports = router;