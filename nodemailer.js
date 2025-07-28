import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // In case this file runs independently

export const accountEmail = "dhananjaybhatia27@gmail.com";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: accountEmail,
    pass: process.env.EMAIL_PASSWORD,
  },
});
