import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import config from "config";

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  userName: string;
}

const sendEmail = async ({
  from,
  to,
  subject,
  text,
  userName,
}: EmailOptions) => {
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Snapnest",
      link: "https://snapnest.com",
    },
  });

  const email = {
    body: {
      name: userName,
      intro: text || "Welcome to SnapNest!",
      outro: "Need help? Just reply to this email, we'd love to help.",
    },
  };

  const emailBody = mailGenerator.generate(email);

  try {
    const transporter = nodemailer.createTransport({
      host: config.get<string>("host"),
      port: config.get<number>("brevoPort"), // Check if this is the correct SMTP port
      auth: {
        user: config.get<string>("userMailLogin"),
        pass: config.get<string>("brevoMailkey"),
      },
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      html: emailBody,
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection failed:", error);
      } else {
        console.log("SMTP connection successful:", success);
      }
    });

    return { success: true, msg: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error); // Log the error details
    return { success: false, msg: "Failed to send email" };
  }
};

export default sendEmail;
