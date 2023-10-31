const nodemailer = require('nodemailer');

// Let's now install nodemailer package so that's the package which we're gonna use to send emails using node.js

// Let's create a function and pass some options so the email address where we want to send an email to, the subject line, the email content and maybe some other stuff.
const sendEmail = async options => {
  // 1) Create a transporter
  // The transporter that we need in the first step here is basically a service that will actually send the email because it's not node.js that will actually send the email itself something like gmail, yahoo, hotmail, sendgrid and mailgun.

  // We will use right now is to use a special development service which basically fakes to send emails to real addresses but in reality these emails endup trapped in a development inbox so that we can then take a look at how they will look later in production and that service is called mailtrap and so let's now sign up for that.

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // const transporter = nodemailer.createTransport({
  //     service: 'Gmail',
  //     auth: {
  //         user: process.env.EMAIL_USERNAME,
  //         pass: process.env.EMAIL_PASSWORD
  //     }

  //     // Activate in gmail "less secure app" option

  // });

  // 2) Define the email options
  const mailOptions = {
    from: 'Abid Arif <hello@abid.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // Actually send the email with nodemailer
  // This will return a promise because it's an asynchronous function
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
