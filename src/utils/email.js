import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";

dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

/***
 * @param {string} otp
 * @param {target} target
 */
export async function sendOTP(otp, target, name) {
  const html = await ejs.renderFile("src/views/email.ejs", { name, otp });
  await transport.sendMail({
    from: process.env.NODEMAILER_USERNAME,
    to: target,
    subject: "Verification Code",
    html,
  });
}
