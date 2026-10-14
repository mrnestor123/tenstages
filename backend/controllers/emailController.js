import nodemailer from 'nodemailer';

export const sendEmail = async (data) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail', // servidor de correo
            auth: {
                user: '@gmail.com', // correo@dominio
                pass: 'ikfesdojcuzmvgsd'    // contraseña de aplicación
            }
        });

        let message = {
            to: data.emails.join(','), // 
            subject: data.subject,
            html: data.message // html body
        };

        transporter.sendMail(message, (error, info) => {
            if (error) {
                throw new Error(error);
            } else {
                return "Email sent";
            }
        });

    } catch (e) {
        throw new Error(e);
    }
}
