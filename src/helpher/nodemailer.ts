require("dotenv").config();
import nodemailer from "nodemailer";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";

const readFile = util.promisify(fs.readFile);

// Load HTML template from file
const loadHtmlTemplate = async (templatePath: string): Promise<string> => {
  const filePath = path.join(__dirname, templatePath);
  return readFile(filePath, "utf-8");
};

// Create Nodemailer transporter
const transportObj: any = {
  host: `${process.env.MAIL_HOST}`,
  port: `${process.env.MAIL_PORT}`,
  auth: {
    user: `${process.env.MAIL_USER}`,
    pass: `${process.env.MAIL_PASS}`,
  },
};

const smtpTrans = nodemailer.createTransport(transportObj);
export class SendEmail {
  private mailOptions = async (
    email: string,
    processedHtml: any,
    name?: string
  ) => {
    return {
      from: "hardiktrivedi@gmail.com",
      to: email,
      subject: `Welcome ${name}`,
      html: processedHtml,
    };
  };
  private replacePlaceholders = async (
    template: string,
    replacements: Record<string, string>
  ): Promise<string> => {
    let result = template;
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, replacements[key]);
    });
    return result;
  };

  public sendLoginEmail = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      // Load HTML template
      const htmlTemplate = await loadHtmlTemplate(
        "../template/signupTemplate.html"
      );

      // Define dynamic data to replace placeholders
      const dynamicData = {
        name: name,
        email: email,
        password: password,
      };
      // Replace placeholders with dynamic data
      const processedHtml = await this.replacePlaceholders(
        htmlTemplate,
        dynamicData
      );

      // Setup email data
      const mailOptions = await this.mailOptions(email, processedHtml, name);
      // Send email
      const info = await smtpTrans.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  public forgotPasswordEmail = async (
    email: string,
    otp: string,
    name: string
  ) => {
    try {
      // Load HTML template
      const htmlTemplate = await loadHtmlTemplate(
        "../template/forgotPassword.html"
      );

      const dynamicData = {
        otp: otp,
      };
      // Replace placeholders with dynamic data
      const processedHtml = await this.replacePlaceholders(
        htmlTemplate,
        dynamicData
      );

      // Setup email data
      const mailOptions = await this.mailOptions(email, processedHtml, name);

      // Send email
      const info = await smtpTrans.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  public updatePasswordEmail = async (
    password: string,
    email: string,
    name: string
  ) => {
    try {
      // Load HTML template
      const htmlTemplate = await loadHtmlTemplate(
        "../template/updatePassword.html"
      );

      const dynamicData = {
        password: password,
      };
      // Replace placeholders with dynamic data
      const processedHtml = await this.replacePlaceholders(
        htmlTemplate,
        dynamicData
      );

      // Setup email data
      const mailOptions = await this.mailOptions(email, processedHtml, name);

      // Send email
      const info = await smtpTrans.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
}
