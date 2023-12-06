import nodemailer from "nodemailer";
require("dotenv").config();

export async function sendMail(
  name: string,
  email: string,
  password: string,
  message: string
) {
  try {
    const transportObj: any = {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    };
    let mailOpts, smtpTrans, mailoutput;
    smtpTrans = nodemailer.createTransport(transportObj);

    if (name || email || password || message) {
      mailoutput = `<html>
                            <body>
                                <table style="text-align: left">
                                    <tr>
                                        <th>Name:</th>
                                        <td>${name}</td>
                                    </tr>
                                    <tr>
                                        <th>Email: </th>
                                        <td>${email}</td>
                                    </tr>
                                    <tr>
                                        <th>Password: </th>
                                        <td>${password}</td>
                                    </tr>
                                    <tr>
                                        <th> Message </th>
                                        <td>${message}</td>
                                    </tr>
                                </table>
                            </body>
                        </html>`;
    } else {
      mailoutput = `<html>
                            <body>
                                <table style="text-align: left">
                                    <tr>
                                        <th>Password: </th>
                                        <td>${password}</td>
                                    </tr>
                                    <tr>
                                        <th> Message </th>
                                        <td>Hey There Your Profile Has Been Updated Sucessfully! </td>
                                    </tr>
                                </table>
                            </body>
                        </html>`;
    }
    mailOpts = {
      to: email,
      subject: message,
      html: mailoutput,
    };

    smtpTrans.sendMail(mailOpts, function (error, _res) {
      if (error) {
        return console.log(error);
      }
    });
    console.log("Message sent successfully!");
  } catch (error) {
    console.log("Somthing failed to sending mail ", error);
  }
}
