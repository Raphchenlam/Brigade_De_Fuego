const nodemailer = require("nodemailer");

const apiKeyGmail = "AIzaSyD6pDAhhEEit4AnDmbuC67J5CoY2yGnrco";

const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
        user: "brigade@eimemanagement.com",
        pass: "Equipedefeu!",
    },
});

function envoyerEmail(destinataires, sujet, texte, html)
{
    const mailOptions = {
        from: "Restaurant Del Fuego",
        to: destinataires.join(", "), // Joindre les destinataires en tant que chaîne séparée par des virgules
        subject: sujet,
        text: texte, // Corps du courriel en texte brut
        html: html, // Corps du courriel au format HTML (optionnel)
    };
    transporter.sendMail(mailOptions, function (erreur, info)
    {
        if (erreur)
        {
            console.error("Erreur lors de l'envoi du courriel : " + erreur);
        } else
        {
            console.log("Courriel envoyé avec succès : " + info.response);
        }
    });
}

module.exports = { envoyerEmail };