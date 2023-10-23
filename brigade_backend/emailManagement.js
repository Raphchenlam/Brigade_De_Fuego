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

function sendEmail(recipients, subjet, text, html)
{
    const mailOptions = {
        from: "brigade@eimemanagement.com",
        to: "brigade@eimemanagement.com",
        bcc: recipients.join(", "),
        subject: subjet,
        text: text, // Corps du courriel en texte brut
        html: html, // Corps du courriel au format HTML (optionnel)
    };
    transporter.sendMail(mailOptions, function (error, info)
    {
        if (erreur)
        {
            console.error("Erreur lors de l'envoi du courriel : " + error);
        } else
        {
            console.info("Courriel envoyé avec succès : " + info.response);
        }
    });
}

module.exports = { sendEmail };

//