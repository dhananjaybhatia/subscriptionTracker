# 📬 Subscription Tracker with Email Reminders

A Node.js-based subscription management system that sends automated **email reminders** for upcoming subscription renewals using **Upstash QStash**, **Nodemailer**, and **MongoDB**.

## ✨ Features

- 🔁 Track recurring subscriptions (weekly, monthly, etc.)
- 📅 Automatically schedule reminders (7, 5, 2, 1 days before renewal)
- 📧 Beautiful, dynamic email templates with renewal details
- 🔔 "Final day reminder" email with clear call to action
- 🛠 Built with Node.js, Express, Mongoose, and Upstash Workflow

## 📦 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)
- **Email:** Nodemailer (Gmail SMTP)
- **Scheduling:** Upstash QStash / Workflows
- **Date Handling:** Day.js
- **Rate Limiting & Security:** Arcjet

- ## 🛡️ Security & Rate Limiting

This app uses **[Arcjet](https://arcjet.com/)** to protect endpoints from abuse by limiting the rate of incoming requests. This ensures:

- Protection from spam or email abuse
- Controlled access to webhook or API endpoints
- Smooth, stable performance under high traffic

