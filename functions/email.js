import nodemailer from 'nodemailer';

async function sendEmails(emails) {
  let transporter = nodemailer.createTransport({
    service: 'Gmail', // servidor de correo
    auth: {
        user: 'usuario del servidor de correo@dominio del servidor de correo',
        pass: 'contraseña del servidor de correo'
    }
  });

  let message = {
    from: 'juan.roig@mercadona.es',
    to: 'ernestbarra97@gmail.com,pepeperezvalenzuela@gmail.com', //emails.join(','),
    subject: 'Compro App',
    html: '<h1>Hola equipo de Tenstages!</h1><p>Soy Juan Roig, el de verdad, podeis verlo en mi email. Quiero ofreceros 10 millones de € por la app. Un saludo.</p>'
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}

sendEmails();