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

// Function to dynamically replace placeholders in the HTML template
const replacePlaceholders = (
  template: string,
  replacements: Record<string, string>
): string => {
  let result = template;
  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, replacements[key]);
  });
  return result;
};

// Main function to send email
const sendEmail = async (name: string, email: string, password: string) => {
  try {
    // Load HTML template
    const htmlTemplate = await loadHtmlTemplate(
      "../template/emailTemplate.html"
    );

    // Define dynamic data to replace placeholders
    const dynamicData = {
      name: name,
      email: email,
      password: password,
    };

    // Replace placeholders with dynamic data
    const processedHtml = replacePlaceholders(htmlTemplate, dynamicData);

    // Setup email data
    const mailOptions = {
      from: "your-email@gmail.com",
      to: "recipient-email@example.com",
      subject: "Test Email with HTML",
      html: processedHtml,
    };

    // Send email
    const info = await smtpTrans.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Invoke the sendEmail function
export default sendEmail;
